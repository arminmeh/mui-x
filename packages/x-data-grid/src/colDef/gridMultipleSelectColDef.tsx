import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridMultipleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditMultipleSelectCell } from '../components/cell/GridEditMultipleSelectCell';
import { renderMultipleSelectCell } from '../components/cell/GridMultipleSelectCell';
import { getGridMultipleSelectOperators } from './gridMultipleSelectOperators';
import {
  getValueOptions,
  isMultipleSelectColDef,
} from '../components/panel/filterPanel/filterPanelUtils';
import { isObject } from '../utils/utils';
import { gridRowIdSelector } from '../hooks/core/gridPropsSelectors';

const isArrayOfObjects = (options: any): options is Array<Record<string, any>> => {
  return typeof options[0] === 'object';
};

const defaultGetOptionValue = (value: ValueOptions) => {
  return isObject(value) ? value.value : value;
};

const defaultGetOptionLabel = (value: ValueOptions) => {
  return isObject(value) ? value.label : String(value);
};

/**
 * Comparator for sorting arrays of values.
 * Sorts by the first element of the array, then by array length if equal.
 */
const multipleSelectSortComparator = (
  v1: any[] | null | undefined,
  v2: any[] | null | undefined,
): number => {
  // Handle null/undefined values
  if (v1 == null && v2 == null) {
    return 0;
  }
  if (v1 == null) {
    return -1;
  }
  if (v2 == null) {
    return 1;
  }

  // Compare by first element
  const firstV1 = v1[0];
  const firstV2 = v2[0];

  if (firstV1 == null && firstV2 == null) {
    return v1.length - v2.length;
  }
  if (firstV1 == null) {
    return -1;
  }
  if (firstV2 == null) {
    return 1;
  }

  // String comparison for first elements
  const strComparison = String(firstV1).localeCompare(String(firstV2));
  if (strComparison !== 0) {
    return strComparison;
  }

  // If first elements are equal, compare by array length
  return v1.length - v2.length;
};

export const GRID_MULTIPLE_SELECT_COL_DEF: Omit<GridMultipleSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'multipleSelect',
  display: 'flex',
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  sortComparator: multipleSelectSortComparator,
  renderCell: renderMultipleSelectCell,
  valueFormatter(value: any[] | null | undefined, row, colDef, apiRef) {
    const rowId = gridRowIdSelector(apiRef, row);

    if (!isMultipleSelectColDef(colDef)) {
      return '';
    }

    const valueOptions = getValueOptions(colDef, { id: rowId, row });

    // Handle null/undefined/empty array
    if (value == null || !Array.isArray(value) || value.length === 0) {
      return '';
    }

    if (!valueOptions) {
      return value.join(', ');
    }

    if (!isArrayOfObjects(valueOptions)) {
      return value.map((v: any) => colDef.getOptionLabel!(v)).join(', ');
    }

    // Map each value to its label
    const labels = value.map((v: any) => {
      const valueOption = valueOptions.find((option) => colDef.getOptionValue!(option) === v);
      return valueOption ? colDef.getOptionLabel!(valueOption) : String(v);
    });

    return labels.join(', ');
  },
  renderEditCell: renderEditMultipleSelectCell,
  filterOperators: getGridMultipleSelectOperators(),
  // @ts-ignore
  pastedValueParser: (value, row, column) => {
    const colDef = column as GridMultipleSelectColDef;
    const valueOptions = getValueOptions(colDef) || [];
    const getOptionValue = colDef.getOptionValue!;
    const getOptionLabel = colDef.getOptionLabel!;

    // Split pasted value by comma and trim whitespace
    const pastedValues = String(value)
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    // Map pasted values to valid option values
    const validValues: any[] = [];

    for (const pastedValue of pastedValues) {
      // Try to find by value first
      let matchedOption = valueOptions.find((option) => {
        const optionValue = getOptionValue(option);
        return String(optionValue) === pastedValue;
      });

      // If not found by value, try to find by label
      if (!matchedOption) {
        matchedOption = valueOptions.find((option) => {
          const optionLabel = getOptionLabel(option);
          return optionLabel === pastedValue;
        });
      }

      if (matchedOption) {
        const matchedValue = getOptionValue(matchedOption);
        // Avoid duplicates
        if (!validValues.includes(matchedValue)) {
          validValues.push(matchedValue);
        }
      }
    }

    // Return array of valid values, or undefined if no valid values found
    return validValues.length > 0 ? validValues : undefined;
  },
};
