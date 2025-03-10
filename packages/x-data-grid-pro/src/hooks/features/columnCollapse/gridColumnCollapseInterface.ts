import { GridColDef } from '@mui/x-data-grid';

/**
 * The column collapse API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnCollapseApi {
  /**
   * Collapses a column by hiding the values in the column but keeping the column name visible.
   * @param {string} field The column field to collapse and hide from view.
   * @returns {void}
   */
  collapseColumn: (field: GridColDef['field']) => void;
  /**
   * Expands a previously collapsed column.
   * @param {string} field The column field to expand.
   */
  expandColumn: (field: GridColDef['field']) => void;
  /**
   * Returns which columns are currently collapsed.
   * @returns {GridColumnCollapseModel} An object containing the fields of collapsed columns.
   */
  getCollapsedColumns: () => GridColumnCollapseModel;
  /**
   * Sets which columns should be collapsed.
   * @param {GridColumnCollapseModel} collapsedColumns An object containing the fields of columns to collapse.
   */
  setCollapsedColumns: (collapsedColumns: GridColumnCollapseModel) => void;
  /**
   * Checks if a column is collapsed.
   * @param {string} field The column field to check.
   * @returns {boolean} Whether the column is collapsed.
   */
  isColumnCollapsed: (field: GridColDef['field']) => boolean;
}

export type GridColumnCollapseModel = Record<GridColDef['field'], boolean>;
export type GridColumnCollapseState = GridColumnCollapseModel;
