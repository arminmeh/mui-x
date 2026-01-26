'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useId from '@mui/utils/useId';
import type { AutocompleteProps } from '../../models/gridBaseSlots';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getValueOptions, isMultipleSelectColDef } from '../panel/filterPanel/filterPanelUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { ValueOptions } from '../../models/colDef/gridColDef';

export interface GridEditMultipleSelectCellProps extends GridRenderEditCellParams {
  /**
   * Callback called when the value is changed by the user.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {any[]} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (event: React.SyntheticEvent, newValue: any[]) => Promise<void> | void;
}

function GridEditMultipleSelectCell(props: GridEditMultipleSelectCellProps) {
  const rootProps = useGridRootProps();
  const {
    id,
    value: valueProp,
    formattedValue,
    api,
    field,
    row,
    rowNode,
    colDef,
    cellMode,
    isEditable,
    tabIndex,
    className,
    hasFocus,
    isValidating,
    isProcessingProps,
    error,
    onValueChange,
    slotProps,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autocompleteId = useId();

  const isMultipleSelect = isMultipleSelectColDef(colDef);
  const valueOptions = isMultipleSelect ? getValueOptions(colDef, { id, row }) : undefined;

  const getOptionValue = React.useMemo(
    () => (isMultipleSelect ? colDef.getOptionValue! : () => undefined),
    [isMultipleSelect, colDef],
  );

  const getOptionLabel = React.useMemo(
    () => (isMultipleSelect ? colDef.getOptionLabel! : () => ''),
    [isMultipleSelect, colDef],
  );

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
    }
  }, [hasFocus]);

  // Convert the current cell value (array of values) to array of option objects
  const currentValues = React.useMemo(() => {
    if (!Array.isArray(valueProp) || !valueOptions) {
      return [];
    }
    return valueProp.reduce<ValueOptions[]>((acc, v) => {
      const option = valueOptions.find((opt) => getOptionValue(opt) === v);
      if (option != null) {
        acc.push(option);
      }
      return acc;
    }, []);
  }, [valueProp, valueOptions, getOptionValue]);

  const isOptionEqualToValue = React.useCallback(
    (option: ValueOptions, value: ValueOptions) => getOptionValue(option) === getOptionValue(value),
    [getOptionValue],
  );

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<ValueOptions, true, false, false>['onChange']>
  >(
    async (event, newValue) => {
      const newCellValue = newValue.map(getOptionValue);

      if (onValueChange) {
        await onValueChange(event, newCellValue);
      }

      await apiRef.current.setEditCellValue({ id, field, value: newCellValue }, event);
    },
    [apiRef, id, field, getOptionValue, onValueChange],
  );

  if (!isMultipleSelect || !valueOptions || !colDef) {
    return null;
  }

  const BaseAutocomplete = rootProps.slots.baseAutocomplete as React.JSXElementConstructor<
    AutocompleteProps<ValueOptions, true, false, false>
  >;

  return (
    <BaseAutocomplete
      multiple
      options={valueOptions}
      isOptionEqualToValue={isOptionEqualToValue}
      id={autocompleteId}
      value={currentValues}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      slotProps={{
        textField: {
          inputRef,
          error,
          fullWidth: true,
        },
      }}
      {...other}
    />
  );
}

GridEditMultipleSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {any[]} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

export { GridEditMultipleSelectCell };

export const renderEditMultipleSelectCell = (params: GridEditMultipleSelectCellProps) => (
  <GridEditMultipleSelectCell {...params} />
);
