import {
  GridInitialState as GridInitialStateCommunity,
  GridState as GridStateCommunity,
  GridColumnPinningState,
  GridPinnedColumnFields,
} from '@mui/x-data-grid';
import type {
  GridDetailPanelState,
  GridDetailPanelInitialState,
  GridColumnReorderState,
  GridColumnCollapseState,
} from '../hooks';
import type { GridDataSourceState } from '../hooks/features/dataSource/models';

/**
 * The state of Data Grid Pro.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  collapsedColumns: GridColumnCollapseState;
  pinnedColumns: GridColumnPinningState;
  detailPanel: GridDetailPanelState;
  dataSource: GridDataSourceState;
}

/**
 * The initial state of Data Grid Pro.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  pinnedColumns?: GridPinnedColumnFields;
  collapsedColumns?: GridColumnCollapseState;
  detailPanel?: GridDetailPanelInitialState;
}
