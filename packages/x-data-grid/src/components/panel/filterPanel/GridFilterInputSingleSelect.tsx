import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { TextFieldProps } from '../../../models/gridBaseSlots';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';
import { GridSingleSelectColDef, GridMultipleSelectColDef } from '../../../models/colDef/gridColDef';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  getValueFromValueOptions,
  getValueOptions,
  isSingleSelectColDef,
  isMultipleSelectColDef,
} from './filterPanelUtils';
import type { GridSlotsComponentsProps } from '../../../models/gridSlotsComponentsProps';

type SelectColDef = GridSingleSelectColDef | GridMultipleSelectColDef;

const renderSingleSelectOptions = ({
  column,
  OptionComponent,
  getOptionLabel,
  getOptionValue,
  isSelectNative,
  baseSelectOptionProps,
}: {
  column: SelectColDef;
  OptionComponent: React.ElementType;
  getOptionLabel: NonNullable<SelectColDef['getOptionLabel']>;
  getOptionValue: NonNullable<SelectColDef['getOptionValue']>;
  isSelectNative: boolean;
  baseSelectOptionProps: GridSlotsComponentsProps['baseSelectOption'];
}) => {
  const iterableColumnValues = ['', ...(getValueOptions(column) || [])];

  return iterableColumnValues.map((option) => {
    const value = getOptionValue(option);
    let label = getOptionLabel(option);
    if (label === '') {
      label = ' '; // To force the height of the empty option
    }

    return (
      <OptionComponent {...baseSelectOptionProps} native={isSelectNative} key={value} value={value}>
        {label}
      </OptionComponent>
    );
  });
};

export type GridFilterInputSingleSelectProps = GridFilterInputValueProps<TextFieldProps> & {
  type?: 'singleSelect' | 'multipleSelect';
};

function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    tabIndex,
    isFilterActive,
    clearButton,
    headerFilterMenu,
    slotProps,
    ...other
  } = props;
  const filterValue = item.value ?? '';
  const id = useId();
  const labelId = useId();
  const rootProps = useGridRootProps();

  const isSelectNative = rootProps.slotProps?.baseSelect?.native ?? false;

  const resolvedColumn = apiRef.current.getColumn(item.field) as SelectColDef | undefined;

  const isSelectColDef =
    resolvedColumn &&
    (isSingleSelectColDef(resolvedColumn) || isMultipleSelectColDef(resolvedColumn));

  const getOptionValue = resolvedColumn?.getOptionValue;

  const currentValueOptions = React.useMemo(() => {
    if (!resolvedColumn || !isSelectColDef) {
      return undefined;
    }
    return getValueOptions(resolvedColumn);
  }, [resolvedColumn, isSelectColDef]);

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (!getOptionValue) {
        return;
      }
      let value = event.target.value;

      // NativeSelect casts the value to a string.
      value = getValueFromValueOptions(value, currentValueOptions, getOptionValue);
      applyValue({ ...item, value });
    },
    [currentValueOptions, getOptionValue, applyValue, item],
  );

  if (!resolvedColumn || !isSelectColDef) {
    return null;
  }

  const label = slotProps?.root.label ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <React.Fragment>
      <rootProps.slots.baseSelect
        fullWidth
        id={id}
        label={label}
        labelId={labelId}
        value={filterValue}
        onChange={onFilterChange}
        slotProps={{
          htmlInput: {
            tabIndex,
            ref: focusElementRef,
            type: type || 'text',
            placeholder:
              slotProps?.root.placeholder ??
              apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
            ...slotProps?.root.slotProps?.htmlInput,
          },
        }}
        native={isSelectNative}
        {...rootProps.slotProps?.baseSelect}
        {...other}
        {...slotProps?.root}
      >
        {renderSingleSelectOptions({
          column: resolvedColumn,
          OptionComponent: rootProps.slots.baseSelectOption,
          getOptionLabel: resolvedColumn.getOptionLabel,
          getOptionValue: resolvedColumn.getOptionValue,
          isSelectNative,
          baseSelectOptionProps: rootProps.slotProps?.baseSelectOption,
        })}
      </rootProps.slots.baseSelect>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>
  );
}

GridFilterInputSingleSelect.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  className: PropTypes.string,
  clearButton: PropTypes.node,
  disabled: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  headerFilterMenu: PropTypes.node,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: (props, propName) => {
        if (props[propName] == null) {
          return null;
        }
        if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
          return new Error(`Expected prop '${propName}' to be of type Element`);
        }
        return null;
      },
    }),
  ]),
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (for example `isEmpty`)
   */
  isFilterActive: PropTypes.bool,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  slotProps: PropTypes.object,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['singleSelect', 'multipleSelect']),
} as any;

export { GridFilterInputSingleSelect };
