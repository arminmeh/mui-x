import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  { id: 1, name: 'Project Alpha', tags: ['frontend', 'urgent'] },
  { id: 2, name: 'Project Beta', tags: ['backend', 'low'] },
  { id: 3, name: 'Project Gamma', tags: ['frontend', 'backend', 'urgent'] },
  { id: 4, name: 'Project Delta', tags: [] },
  { id: 5, name: 'Project Epsilon', tags: ['backend'] },
];

const columns = [
  { field: 'name', headerName: 'Project', width: 150 },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 250,
    type: 'multipleSelect',
    editable: true,
    valueOptions: ['frontend', 'backend', 'urgent', 'low', 'blocked'],
  },
];

export default function MultipleSelectColDef() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [],
            },
          },
        }}
      />
    </div>
  );
}
