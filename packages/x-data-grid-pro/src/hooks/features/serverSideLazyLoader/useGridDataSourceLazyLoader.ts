import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { throttle } from '@mui/x-internals/throttle';
import { unstable_debounce as debounce } from '@mui/utils';
import {
  useGridApiEventHandler,
  gridSortModelSelector,
  gridFilterModelSelector,
  GridEventListener,
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridSkeletonRowNode,
  gridPaginationModelSelector,
  gridDimensionsSelector,
  gridFilteredSortedRowIdsSelector,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  gridRenderContextSelector,
  GridStrategyGroup,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  runIf,
  DataSourceRowsUpdateStrategy,
} from '@mui/x-data-grid/internals';
import { GridGetRowsParamsPro as GridGetRowsParams } from '../dataSource/models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_SKELETON_ROW_ROOT_ID } from '../lazyLoader/useGridLazyLoaderPreProcessors';

enum LoadingTrigger {
  VIEWPORT,
  SCROLL_END,
}

const REQUEST_RANGE_INITIAL_STATE = {
  start: 0,
  end: 0,
};

const getSkeletonRowId = (index: number) => `${GRID_SKELETON_ROW_ROOT_ID}-${index}`;

/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridDataSourceLazyLoader = (
  privateApiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'pagination'
    | 'paginationMode'
    | 'dataSource'
    | 'lazyLoading'
    | 'lazyLoadingRequestThrottleMs'
    | 'scrollEndThreshold'
  >,
): void => {
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.LazyLoading,
      props.dataSource && props.lazyLoading ? () => true : () => false,
    );
  }, [privateApiRef, props.lazyLoading, props.dataSource]);

  const [lazyLoadingRowsUpdateStrategyActive, setLazyLoadingRowsUpdateStrategyActive] =
    React.useState(false);
  const lastRequestRowRange = React.useRef<{ start: number | string; end: number }>(
    REQUEST_RANGE_INITIAL_STATE,
  );
  const previousLastRowIndex = React.useRef(0);
  const loadingTrigger = React.useRef<LoadingTrigger | null>(null);
  const rowsStale = React.useRef<boolean>(false);

  const fetchRows = React.useCallback(
    (params: Partial<GridGetRowsParams>) => {
      privateApiRef.current.dataSource.fetchRows(GRID_ROOT_GROUP_ID, params);
    },
    [privateApiRef],
  );

  const debouncedFetchRows = React.useMemo(() => debounce(fetchRows, 0), [fetchRows]);

  // Adjust the render context range to fit the pagination model's page size
  // First row index should be decreased to the start of the page, end row index should be increased to the end of the page
  const adjustRowParams = React.useCallback(
    (params: GridGetRowsParams) => {
      if (typeof params.start !== 'number') {
        return params;
      }

      const paginationModel = gridPaginationModelSelector(privateApiRef);

      return {
        ...params,
        start: params.start - (params.start % paginationModel.pageSize),
        end: params.end + paginationModel.pageSize - (params.end % paginationModel.pageSize) - 1,
      };
    },
    [privateApiRef],
  );

  const resetGrid = React.useCallback(() => {
    privateApiRef.current.setLoading(true);
    privateApiRef.current.dataSource.cache.clear();
    rowsStale.current = true;
    previousLastRowIndex.current = 0;
    const paginationModel = gridPaginationModelSelector(privateApiRef);
    const sortModel = gridSortModelSelector(privateApiRef);
    const filterModel = gridFilterModelSelector(privateApiRef);
    const getRowsParams: GridGetRowsParams = {
      start: 0,
      end: paginationModel.pageSize - 1,
      sortModel,
      filterModel,
    };

    fetchRows(getRowsParams);
  }, [privateApiRef, fetchRows]);

  const ensureValidRowCount = React.useCallback(
    (previousLoadingTrigger: LoadingTrigger, newLoadingTrigger: LoadingTrigger) => {
      // switching from lazy loading to infinite loading should always reset the grid
      // since there is no guarantee that the new data will be placed correctly
      // there might be some skeleton rows in between the data or the data has changed (row count became unknown)
      if (
        previousLoadingTrigger === LoadingTrigger.VIEWPORT &&
        newLoadingTrigger === LoadingTrigger.SCROLL_END
      ) {
        resetGrid();
        return;
      }

      // switching from infinite loading to lazy loading should reset the grid only if the known row count
      // is smaller than the amount of rows rendered
      const tree = privateApiRef.current.state.rows.tree;
      const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
      const rootGroupChildren = [...rootGroup.children];

      const pageRowCount = privateApiRef.current.state.pagination.rowCount;
      const rootChildrenCount = rootGroupChildren.length;

      if (rootChildrenCount > pageRowCount) {
        resetGrid();
      }
    },
    [privateApiRef, resetGrid],
  );

  const addSkeletonRows = React.useCallback(() => {
    const tree = privateApiRef.current.state.rows.tree;
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const rootChildrenCount = rootGroupChildren.length;

    /**
     * Do nothing if
     * - rowCount is unknown
     * - children count is 0
     * - children count is equal to rowCount
     */
    if (
      pageRowCount === -1 ||
      pageRowCount === undefined ||
      rootChildrenCount === 0 ||
      rootChildrenCount === pageRowCount
    ) {
      return;
    }

    // fill the grid with skeleton rows
    for (let i = 0; i < pageRowCount - rootChildrenCount; i += 1) {
      const skeletonId = getSkeletonRowId(i + rootChildrenCount); // to avoid duplicate keys on rebuild
      rootGroupChildren.push(skeletonId);

      const skeletonRowNode: GridSkeletonRowNode = {
        type: 'skeletonRow',
        id: skeletonId,
        parent: GRID_ROOT_GROUP_ID,
        depth: 0,
      };

      tree[skeletonId] = skeletonRowNode;
    }

    tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };

    privateApiRef.current.setState(
      (state) => ({
        ...state,
        rows: {
          ...state.rows,
          tree,
        },
      }),
      'addSkeletonRows',
    );
  }, [privateApiRef]);

  const updateLoadingTrigger = React.useCallback(
    (rowCount: number) => {
      const newLoadingTrigger =
        rowCount === -1 ? LoadingTrigger.SCROLL_END : LoadingTrigger.VIEWPORT;

      if (loadingTrigger.current !== null) {
        ensureValidRowCount(loadingTrigger.current, newLoadingTrigger);
      }

      if (loadingTrigger.current !== newLoadingTrigger) {
        loadingTrigger.current = newLoadingTrigger;
      }
    },
    [ensureValidRowCount],
  );

  /**
   * Update rows ensuring that there are no duplicate ids
   * If some other page has already a row with the id that is about to be added, replace that row with a skeleton row
   */
  const updateRowsUnique = React.useCallback(
    (rows: GridValidRowModel[], startingIndex: number) => {
      const tree = privateApiRef.current.state.rows.tree;
      const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
      const rootGroupChildren = [...rootGroup.children];
      const currentRowIds = gridFilteredSortedRowIdsSelector(privateApiRef);

      rows.forEach((row) => {
        const rowIndex = currentRowIds.indexOf(row.id);
        if (rowIndex !== -1) {
          const skeletonId = getSkeletonRowId(rowIndex);
          rootGroupChildren[rowIndex] = skeletonId;

          const skeletonRowNode: GridSkeletonRowNode = {
            type: 'skeletonRow',
            id: skeletonId,
            parent: GRID_ROOT_GROUP_ID,
            depth: 0,
          };

          tree[skeletonId] = skeletonRowNode;
        }
      });

      tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };
      privateApiRef.current.unstable_replaceRows(startingIndex, rows);
    },
    [privateApiRef],
  );

  const handleDataUpdate = React.useCallback<GridStrategyProcessor<'dataSourceRowsUpdate'>>(
    (params) => {
      if ('error' in params) {
        return;
      }

      const { response, fetchParams } = params;
      const pageRowCount = privateApiRef.current.state.pagination.rowCount;
      if (response.rowCount !== undefined || pageRowCount === undefined) {
        privateApiRef.current.setRowCount(response.rowCount === undefined ? -1 : response.rowCount);
      }

      // scroll to the top if the rows are stale and the new request is for the first page
      if (rowsStale.current && params.fetchParams.start === 0) {
        privateApiRef.current.scroll({ top: 0 });
        // the rows can safely be replaced. skeleton rows will be added later
        privateApiRef.current.setRows(response.rows);
      } else {
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(privateApiRef);

        const startingIndex =
          typeof fetchParams.start === 'string'
            ? Math.max(filteredSortedRowIds.indexOf(fetchParams.start), 0)
            : fetchParams.start;

        updateRowsUnique(response.rows, startingIndex);
      }

      rowsStale.current = false;

      if (loadingTrigger.current === null) {
        updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
      }

      addSkeletonRows();
      privateApiRef.current.setLoading(false);
      privateApiRef.current.unstable_applyPipeProcessors(
        'processDataSourceRows',
        { params: params.fetchParams, response },
        false,
      );
      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    },
    [privateApiRef, updateLoadingTrigger, addSkeletonRows, updateRowsUnique],
  );

  const handleRowCountChange = React.useCallback(() => {
    if (rowsStale.current || loadingTrigger.current === null) {
      return;
    }

    updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
    addSkeletonRows();
    privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [privateApiRef, updateLoadingTrigger, addSkeletonRows]);

  const handleScrolling: GridEventListener<'scrollPositionChange'> = React.useCallback(
    (newScrollPosition) => {
      if (rowsStale.current || loadingTrigger.current !== LoadingTrigger.SCROLL_END) {
        return;
      }

      const renderContext = gridRenderContextSelector(privateApiRef);
      if (previousLastRowIndex.current >= renderContext.lastRowIndex) {
        return;
      }

      const dimensions = gridDimensionsSelector(privateApiRef);
      const position = newScrollPosition.top + dimensions.viewportInnerSize.height;
      const target = dimensions.contentSize.height - props.scrollEndThreshold;

      if (position >= target) {
        previousLastRowIndex.current = renderContext.lastRowIndex;

        const paginationModel = gridPaginationModelSelector(privateApiRef);
        const sortModel = gridSortModelSelector(privateApiRef);
        const filterModel = gridFilterModelSelector(privateApiRef);
        const getRowsParams: GridGetRowsParams = {
          start: renderContext.lastRowIndex,
          end: renderContext.lastRowIndex + paginationModel.pageSize - 1,
          sortModel,
          filterModel,
        };

        privateApiRef.current.setLoading(true);

        fetchRows(adjustRowParams(getRowsParams));
      }
    },
    [privateApiRef, props.scrollEndThreshold, adjustRowParams, fetchRows],
  );

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (rowsStale.current) {
        return;
      }

      const sortModel = gridSortModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);
      const getRowsParams: GridGetRowsParams = {
        start: params.firstRowIndex,
        end: params.lastRowIndex,
        sortModel,
        filterModel,
      };

      const adjustedParams = adjustRowParams(getRowsParams);

      if (
        lastRequestRowRange.current.start <= adjustedParams.start &&
        lastRequestRowRange.current.end >= adjustedParams.end
      ) {
        return;
      }

      lastRequestRowRange.current = {
        start: adjustedParams.start,
        end: adjustedParams.end,
      };

      fetchRows(adjustedParams);
    },
    [privateApiRef, adjustRowParams, fetchRows],
  );

  const throttledHandleRenderedRowsIntervalChange = React.useMemo(
    () => throttle(handleRenderedRowsIntervalChange, props.lazyLoadingRequestThrottleMs),
    [props.lazyLoadingRequestThrottleMs, handleRenderedRowsIntervalChange],
  );
  React.useEffect(() => {
    return () => {
      throttledHandleRenderedRowsIntervalChange.clear();
    };
  }, [throttledHandleRenderedRowsIntervalChange]);

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      rowsStale.current = true;
      throttledHandleRenderedRowsIntervalChange.clear();
      previousLastRowIndex.current = 0;
      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);

      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.setLoading(true);
      debouncedFetchRows(getRowsParams);
    },
    [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      rowsStale.current = true;
      throttledHandleRenderedRowsIntervalChange.clear();
      previousLastRowIndex.current = 0;

      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const sortModel = gridSortModelSelector(privateApiRef);
      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.setLoading(true);
      debouncedFetchRows(getRowsParams);
    },
    [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange],
  );

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    setLazyLoadingRowsUpdateStrategyActive(
      privateApiRef.current.getActiveStrategy(GridStrategyGroup.DataSource) ===
        DataSourceRowsUpdateStrategy.LazyLoading,
    );
  }, [privateApiRef]);

  useGridRegisterStrategyProcessor(
    privateApiRef,
    DataSourceRowsUpdateStrategy.LazyLoading,
    'dataSourceRowsUpdate',
    handleDataUpdate,
  );

  useGridApiEventHandler(privateApiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);

  useGridApiEventHandler(
    privateApiRef,
    'rowCountChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleRowCountChange),
  );
  useGridApiEventHandler(
    privateApiRef,
    'scrollPositionChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleScrolling),
  );
  useGridApiEventHandler(
    privateApiRef,
    'renderedRowsIntervalChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, throttledHandleRenderedRowsIntervalChange),
  );
  useGridApiEventHandler(
    privateApiRef,
    'sortModelChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleGridSortModelChange),
  );
  useGridApiEventHandler(
    privateApiRef,
    'filterModelChange',
    runIf(lazyLoadingRowsUpdateStrategyActive, handleGridFilterModelChange),
  );

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
