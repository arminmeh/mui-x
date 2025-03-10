import * as React from 'react';

export interface GridProIconSlotsComponent {
  /**
   * Icon displayed in column menu for left pinning
   * @default GridPushPinLeftIcon
   */
  columnMenuPinLeftIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for right pinning
   * @default GridPushPinRightIcon
   */
  columnMenuPinRightIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for collapsing the column
   * @default GridCollapseIcon
   */
  columnMenuCollapseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for expanding the column
   * @default GridExpandIcon
   */
  columnMenuExpandIcon: React.JSXElementConstructor<any>;
}
