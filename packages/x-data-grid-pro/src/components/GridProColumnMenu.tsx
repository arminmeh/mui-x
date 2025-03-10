import * as React from 'react';
import {
  GridGenericColumnMenu,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_SLOTS,
  GRID_COLUMN_MENU_SLOT_PROPS,
} from '@mui/x-data-grid';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridColumnMenuPinningItem } from './GridColumnMenuPinningItem';
import { GridColumnMenuCollapseItem } from './GridColumnMenuCollapseItem';

export const GRID_COLUMN_MENU_SLOTS_PRO = {
  ...GRID_COLUMN_MENU_SLOTS,
  columnMenuPinningItem: GridColumnMenuPinningItem,
  columnMenuCollapseItem: GridColumnMenuCollapseItem,
};

export const GRID_COLUMN_MENU_SLOT_PROPS_PRO = {
  ...GRID_COLUMN_MENU_SLOT_PROPS,
  columnMenuPinningItem: {
    displayOrder: 15,
  },
  columnMenuCollapseItem: {
    displayOrder: 30,
  },
};

export const GridProColumnMenu = forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenu(props, ref) {
    return (
      <GridGenericColumnMenu
        {...props}
        defaultSlots={GRID_COLUMN_MENU_SLOTS_PRO}
        defaultSlotProps={GRID_COLUMN_MENU_SLOT_PROPS_PRO}
        ref={ref}
      />
    );
  },
);
