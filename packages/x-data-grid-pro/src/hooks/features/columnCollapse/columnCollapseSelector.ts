import { createRootSelector } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridColumnCollapseSelector = createRootSelector(
  (state: GridStatePro) => state.collapsedColumns,
);
