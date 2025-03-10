import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridColumnMenuCollapseItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const collapseColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.collapseColumn(colDef.field);
      onClick(event);
    },
    [apiRef, colDef.field, onClick],
  );

  const expandColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.expandColumn(colDef.field);
    onClick(event);
  };

  if (!colDef) {
    return null;
  }

  const isCollapsed = apiRef.current.isColumnCollapsed(colDef.field);
  const label = isCollapsed ? 'columnMenuExpand' : 'columnMenuCollapse';
  const Icon = isCollapsed
    ? rootProps.slots.columnMenuExpandIcon
    : rootProps.slots.columnMenuCollapseIcon;
  const onMenuItemClick = isCollapsed ? expandColumn : collapseColumn;
  return (
    <rootProps.slots.baseMenuItem onClick={onMenuItemClick} iconStart={<Icon fontSize="small" />}>
      {apiRef.current.getLocaleText(label)}
    </rootProps.slots.baseMenuItem>
  );
}

GridColumnMenuCollapseItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuCollapseItem };
