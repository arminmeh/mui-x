import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'position',
  'company',
  'salary',
  'phone',
  'country',
  'dateCreated',
  'isAdmin',
];

export default function AssistantWithDataSampling() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        initialState={{
          aiAssistant: {
            suggestions: [
              'Sort by name',
              'Show people from the EU',
              'Sort by company name and employee name',
              'Order companies by amount of people',
            ],
          },
        }}
        allowAiAssistantDataSampling
        enableAiAssistant
        onPrompt={mockPromptResolver}
        showToolbar
      />
    </div>
  );
}
