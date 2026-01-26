import { GridFilterInputSingleSelect } from '../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleSingleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';
import { isObject } from '../utils/utils';

const parseObjectValue = (value: unknown) => {
  if (value == null || !isObject<{ value: unknown }>(value)) {
    return value;
  }
  return value.value;
};

export const getGridMultipleSelectOperators = (): GridFilterOperator[] => [
  {
    value: 'contains',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      const filterValue = parseObjectValue(filterItem.value);
      return (value): boolean => {
        if (!Array.isArray(value)) {
          return false;
        }
        return value.some((v) => parseObjectValue(v) === filterValue);
      };
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'notContains',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      const filterValue = parseObjectValue(filterItem.value);
      return (value): boolean => {
        if (!Array.isArray(value)) {
          return true;
        }
        return !value.some((v) => parseObjectValue(v) === filterValue);
      };
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'containsAny',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterValues = filterItem.value.map(parseObjectValue);
      return (value): boolean => {
        if (!Array.isArray(value)) {
          return false;
        }
        return value.some((v) => filterValues.includes(parseObjectValue(v)));
      };
    },
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
  {
    value: 'containsAll',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterValues = filterItem.value.map(parseObjectValue);
      return (value): boolean => {
        if (!Array.isArray(value)) {
          return false;
        }
        const cellValues = value.map(parseObjectValue);
        return filterValues.every((filterValue) => cellValues.includes(filterValue));
      };
    },
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
  {
    value: 'isEmpty',
    getApplyFilterFn: () => {
      return (value): boolean => {
        return value == null || !Array.isArray(value) || value.length === 0;
      };
    },
    requiresFilterValue: false,
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: () => {
      return (value): boolean => {
        return Array.isArray(value) && value.length > 0;
      };
    },
    requiresFilterValue: false,
  },
];
