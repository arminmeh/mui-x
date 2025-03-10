import { GridSlotsComponentsProps } from '@mui/x-data-grid/internals';
import type { GridHeaderFilterCellProps } from '../components/headerFiltering/GridHeaderFilterCell';
import type { GridColumnHeaderCollapseIconProps } from '../components/GridColumnHeaderCollapseIcon';

// Overrides for module augmentation
export interface HeaderFilterCellPropsOverrides {}
export interface ColumnHeaderCollapseIconPropsOverrides {}

type SlotProps<Props, Overrides> = Partial<Props & Overrides>;

export interface GridProSlotProps extends GridSlotsComponentsProps {
  headerFilterCell?: SlotProps<GridHeaderFilterCellProps, HeaderFilterCellPropsOverrides>;
  columnHeaderCollapseIcon?: SlotProps<
    GridColumnHeaderCollapseIconProps,
    ColumnHeaderCollapseIconPropsOverrides
  >;
}
