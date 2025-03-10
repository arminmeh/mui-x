import type { GridProIconSlotsComponent } from '../models';
import {
  GridPushPinRightIcon,
  GridPushPinLeftIcon,
  GridCollapseIcon,
  GridExpandIcon,
} from './icons';

const iconSlots: GridProIconSlotsComponent = {
  columnMenuPinRightIcon: GridPushPinRightIcon,
  columnMenuPinLeftIcon: GridPushPinLeftIcon,
  columnMenuCollapseIcon: GridCollapseIcon,
  columnMenuExpandIcon: GridExpandIcon,
};

const materialSlots = {
  ...iconSlots,
};

export default materialSlots;
