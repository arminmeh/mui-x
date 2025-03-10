import * as React from 'react';
import PropTypes from 'prop-types';
import { GridIconButtonContainer } from '@mui/x-data-grid/internals';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export interface GridColumnHeaderCollapseIconProps {
  field: string;
}

function GridColumnHeaderCollapseIconRaw(props: GridColumnHeaderCollapseIconProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  return (
    <GridIconButtonContainer>
      <rootProps.slots.baseIconButton
        tabIndex={-1}
        aria-label={apiRef.current.getLocaleText('columnHeaderCollapseIconLabel')}
        title={apiRef.current.getLocaleText('columnHeaderCollapseIconLabel')}
        size="small"
        {...rootProps.slotProps?.baseIconButton}
        {...props}
      >
        <rootProps.slots.columnMenuCollapseIcon />
      </rootProps.slots.baseIconButton>
    </GridIconButtonContainer>
  );
}

const GridColumnHeaderCollapseIcon = React.memo(GridColumnHeaderCollapseIconRaw);

GridColumnHeaderCollapseIconRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  field: PropTypes.string.isRequired,
} as any;

export { GridColumnHeaderCollapseIcon };
