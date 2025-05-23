import * as React from 'react';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SimpleHeaderFilteringDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        disableColumnFilter
        headerFilters
        slots={{
          headerFilterMenu: null,
        }}
        sx={{ [`.${gridClasses['columnHeader--filter']}`]: { px: 1 } }}
      />
    </div>
  );
}
