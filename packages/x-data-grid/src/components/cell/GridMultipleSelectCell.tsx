'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getValueOptions, isMultipleSelectColDef } from '../panel/filterPanel/filterPanelUtils';
import type { ValueOptions } from '../../models/colDef/gridColDef';

export interface GridMultipleSelectCellProps extends GridRenderCellParams {
  /**
   * The maximum number of chips to display before showing "+N more".
   * @default 2
   */
  maxChips?: number;
}

const ChipsContainer = styled('div')({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: 4,
  overflow: 'hidden',
  alignItems: 'center',
  width: '100%',
});

const MoreChip = styled('span')(({ theme }) => ({
  fontSize: '0.75rem',
  color: (theme as any).palette?.text?.secondary || '#666',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}));

function GridMultipleSelectCell(props: GridMultipleSelectCellProps) {
  const { id, value, colDef, row, maxChips = 2 } = props;
  const rootProps = useGridRootProps();

  if (!isMultipleSelectColDef(colDef)) {
    return null;
  }

  const valueOptions = getValueOptions(colDef, { id, row });

  // Handle empty/null values
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const getOptionValue = colDef.getOptionValue!;
  const getOptionLabel = colDef.getOptionLabel!;

  // Map values to labels
  const labels: string[] = value.map((v) => {
    if (!valueOptions) {
      return String(v);
    }
    const option = valueOptions.find((opt: ValueOptions) => getOptionValue(opt) === v);
    return option ? getOptionLabel(option) : String(v);
  });

  const visibleLabels = labels.slice(0, maxChips);
  const hiddenCount = labels.length - maxChips;

  const BaseChip = rootProps.slots.baseChip;

  return (
    <ChipsContainer>
      {visibleLabels.map((label, index) => (
        <BaseChip
          key={index}
          label={label}
          size="small"
          variant="outlined"
          {...rootProps.slotProps?.baseChip}
        />
      ))}
      {hiddenCount > 0 && <MoreChip>+{hiddenCount}</MoreChip>}
    </ChipsContainer>
  );
}

export { GridMultipleSelectCell };

export const renderMultipleSelectCell = (params: GridMultipleSelectCellProps) => (
  <GridMultipleSelectCell {...params} />
);
