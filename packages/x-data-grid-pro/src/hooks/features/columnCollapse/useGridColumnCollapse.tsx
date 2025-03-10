import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useGridSelector, useGridApiMethod } from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  GridStateInitializer,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { GridInitialStatePro } from '../../../models/gridStatePro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridColumnCollapseApi, GridColumnCollapseModel } from './gridColumnCollapseInterface';
import { gridColumnCollapseSelector } from './columnCollapseSelector';

export const columnCollapseStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'collapsedColumns' | 'initialState'>
> = (state, props) => {
  let model: GridColumnCollapseModel;
  if (props.collapsedColumns) {
    model = props.collapsedColumns;
  } else if (props.initialState?.collapsedColumns) {
    model = props.initialState.collapsedColumns;
  } else {
    model = {};
  }

  return {
    ...state,
    collapsedColumns: model,
  };
};

export const useGridColumnCollapse = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'disableColumnCollapse' | 'initialState' | 'collapsedColumns' | 'onCollapsedColumnsChange'
  >,
): void => {
  const collapsedColumns = useGridSelector(apiRef, gridColumnCollapseSelector);

  const addColumnMenuItems = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, colDef) => {
      if (props.disableColumnCollapse) {
        return columnMenuItems;
      }

      if (colDef.pinnable === false) {
        return columnMenuItems;
      }

      return [...columnMenuItems, 'columnMenuCollapseItem'];
    },
    [props.disableColumnCollapse],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const collapsedColumnsToExport = gridColumnCollapseSelector(apiRef);

      const shouldExportCollapsedColumns =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the model is controlled
        props.collapsedColumns != null ||
        // Always export if the model has been initialized
        props.initialState?.collapsedColumns != null;

      if (!shouldExportCollapsedColumns) {
        return prevState;
      }

      return {
        ...prevState,
        pinnedColumns: collapsedColumnsToExport,
      };
    },
    [apiRef, props.collapsedColumns, props.initialState?.collapsedColumns],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePro>) => {
      const newCollapsedColumns = context.stateToRestore.collapsedColumns;
      if (newCollapsedColumns != null) {
        setState(apiRef, newCollapsedColumns);
      }

      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItems);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  apiRef.current.registerControlState({
    stateId: 'collapsedColumns',
    propModel: props.collapsedColumns,
    propOnChange: props.onCollapsedColumnsChange,
    stateSelector: gridColumnCollapseSelector,
    changeEvent: 'collapsedColumnsChange',
  });

  const collapseColumn = React.useCallback<GridColumnCollapseApi['collapseColumn']>(
    (field: string) => {
      if (apiRef.current.isColumnCollapsed(field)) {
        return;
      }

      apiRef.current.setCollapsedColumns({
        ...collapsedColumns,
        [field]: true,
      });
    },
    [apiRef, collapsedColumns],
  );

  const expandColumn = React.useCallback<GridColumnCollapseApi['expandColumn']>(
    (field: string) => {
      if (!apiRef.current.isColumnCollapsed(field)) {
        return;
      }

      const newCollapsedColumns = { ...collapsedColumns };
      delete newCollapsedColumns[field];

      apiRef.current.setCollapsedColumns(newCollapsedColumns);
    },
    [apiRef, collapsedColumns],
  );

  const getCollapsedColumns = React.useCallback<
    GridColumnCollapseApi['getCollapsedColumns']
  >(() => {
    return gridColumnCollapseSelector(apiRef);
  }, [apiRef]);

  const setCollapsedColumns = React.useCallback<GridColumnCollapseApi['setCollapsedColumns']>(
    (newCollapsedColumns) => {
      setState(apiRef, newCollapsedColumns);
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    },
    [apiRef],
  );

  const isColumnCollapsed = React.useCallback<GridColumnCollapseApi['isColumnCollapsed']>(
    (field) => collapsedColumns[field] ?? false,
    [collapsedColumns],
  );

  const columnCollapseApi: GridColumnCollapseApi = {
    collapseColumn,
    expandColumn,
    getCollapsedColumns,
    setCollapsedColumns,
    isColumnCollapsed,
  };

  useGridApiMethod(apiRef, columnCollapseApi, 'public');

  React.useEffect(() => {
    if (props.collapsedColumns) {
      apiRef.current.setCollapsedColumns(props.collapsedColumns);
    }
  }, [apiRef, props.collapsedColumns]);
};

function setState(apiRef: RefObject<GridPrivateApiPro>, model: GridColumnCollapseModel) {
  apiRef.current.setState((state) => ({
    ...state,
    collapsedColumns: model,
  }));
}
