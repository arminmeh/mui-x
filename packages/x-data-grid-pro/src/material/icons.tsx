import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';

export const GridPushPinRightIcon = createSvgIcon(
  <g transform="rotate(-30 15 10)">
    <path
      d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z"
      fillRule="evenodd"
    />
  </g>,
  'PushPinRight',
);

export const GridPushPinLeftIcon = createSvgIcon(
  <g transform="rotate(30 8 12)">
    <path
      d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z"
      fillRule="evenodd"
    />
  </g>,
  'PushPinLeft',
);

export const GridCollapseIcon = createSvgIcon(
  <g transform="rotate(90 12 12)">
    <path d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z" />
  </g>,
  'Collapse',
);

export const GridExpandIcon = createSvgIcon(
  <g transform="rotate(90 12 12)">
    <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
  </g>,
  'Expand',
);
