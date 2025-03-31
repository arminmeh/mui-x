import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const viVNGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Không có dữ liệu',
  noResultsOverlayLabel: 'Không tìm thấy kết quả.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Độ giãn',
  toolbarDensityLabel: 'Độ giãn',
  toolbarDensityCompact: 'Trung bình',
  toolbarDensityStandard: 'Tiêu chuẩn',
  toolbarDensityComfortable: 'Rộng',

  // Columns selector toolbar button text
  toolbarColumns: 'Cột',
  toolbarColumnsLabel: 'Chọn cột',

  // Filters toolbar button text
  toolbarFilters: 'Bộ lọc',
  toolbarFiltersLabel: 'Hiển thị bộ lọc',
  toolbarFiltersTooltipHide: 'Ẩn',
  toolbarFiltersTooltipShow: 'Hiện',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} bộ lọc hoạt động` : `${count} bộ lọc hoạt động`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Tìm kiếm…',
  toolbarQuickFilterLabel: 'Tìm kiếm',
  toolbarQuickFilterDeleteIconLabel: 'Xóa tìm kiếm',

  // Export selector toolbar button text
  toolbarExport: 'Xuất',
  toolbarExportLabel: 'Xuất',
  toolbarExportCSV: 'Xuất CSV',
  toolbarExportPrint: 'In',
  toolbarExportExcel: 'Xuất Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Tìm kiếm',
  columnsManagementNoColumns: 'Không có cột',
  columnsManagementShowHideAllText: 'Hiện/Ẩn Tất cả',
  columnsManagementReset: 'Đặt lại',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Thêm bộ lọc',
  filterPanelRemoveAll: 'Xóa tất cả',
  filterPanelDeleteIconLabel: 'Xóa',
  filterPanelLogicOperator: 'Toán tử logic',
  filterPanelOperator: 'Toán tử',
  filterPanelOperatorAnd: 'Và',
  filterPanelOperatorOr: 'Hoặc',
  filterPanelColumns: 'Cột',
  filterPanelInputLabel: 'Giá trị',
  filterPanelInputPlaceholder: 'Lọc giá trị',

  // Filter operators text
  filterOperatorContains: 'chứa',
  filterOperatorDoesNotContain: 'không chứa',
  filterOperatorEquals: 'bằng',
  filterOperatorDoesNotEqual: 'không bằng',
  filterOperatorStartsWith: 'bắt đầu với',
  filterOperatorEndsWith: 'kết thúc với',
  filterOperatorIs: 'là',
  filterOperatorNot: 'không phải là',
  filterOperatorAfter: 'sau',
  filterOperatorOnOrAfter: 'bằng hoặc sau',
  filterOperatorBefore: 'trước',
  filterOperatorOnOrBefore: 'bằng hoặc trước',
  filterOperatorIsEmpty: 'rỗng',
  filterOperatorIsNotEmpty: 'khác rỗng',
  filterOperatorIsAnyOf: 'là một trong',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Chứa',
  headerFilterOperatorDoesNotContain: 'Không chứa',
  headerFilterOperatorEquals: 'Bằng',
  headerFilterOperatorDoesNotEqual: 'Không bằng',
  headerFilterOperatorStartsWith: 'Bắt đầu với',
  headerFilterOperatorEndsWith: 'Kết thúc với',
  headerFilterOperatorIs: 'Là',
  headerFilterOperatorNot: 'Không phải là',
  headerFilterOperatorAfter: 'Sau',
  headerFilterOperatorOnOrAfter: 'Bằng hoặc sau',
  headerFilterOperatorBefore: 'Trước',
  headerFilterOperatorOnOrBefore: 'Bằng hoặc trước',
  headerFilterOperatorIsEmpty: 'Rỗng',
  headerFilterOperatorIsNotEmpty: 'Khác rỗng',
  headerFilterOperatorIsAnyOf: 'Là một trong',
  'headerFilterOperator=': 'Bằng',
  'headerFilterOperator!=': 'Khác',
  'headerFilterOperator>': 'Lớn hơn',
  'headerFilterOperator>=': 'Lớn hơn hoặc bằng',
  'headerFilterOperator<': 'Nhỏ hơn',
  'headerFilterOperator<=': 'Nhỏ hơn hoặc bằng',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'bất kỳ giá trị nào',
  filterValueTrue: 'Có',
  filterValueFalse: 'Không',

  // Column menu text
  columnMenuLabel: 'Danh mục',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Danh sách cột',
  columnMenuManageColumns: 'Quản lý cột',
  columnMenuFilter: 'Bộ lọc',
  columnMenuHideColumn: 'Ẩn cột',
  columnMenuUnsort: 'Bỏ sắp xếp',
  columnMenuSortAsc: 'Sắp xếp tăng dần',
  columnMenuSortDesc: 'Sắp xếp giảm dần',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} bộ lọc hoạt động` : `${count} bộ lọc hoạt động`,
  columnHeaderFiltersLabel: 'Bộ lọc',
  columnHeaderSortIconLabel: 'Sắp xếp',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1 ? `${count.toLocaleString()} hàng đã chọn` : `${count.toLocaleString()} hàng đã chọn`,

  // Total row amount footer text
  footerTotalRows: 'Tổng:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Tích vào ô trống',
  checkboxSelectionSelectAllRows: 'Chọn tất cả hàng',
  checkboxSelectionUnselectAllRows: 'Bỏ chọn tất cả hàng',
  checkboxSelectionSelectRow: 'Chọn hàng',
  checkboxSelectionUnselectRow: 'Bỏ chọn hàng',

  // Boolean cell text
  booleanCellTrueLabel: 'Có',
  booleanCellFalseLabel: 'Không',

  // Actions cell more text
  actionsCellMore: 'Thêm',

  // Column pinning text
  pinToLeft: 'Ghim cột bên trái',
  pinToRight: 'Ghim cột bên phải',
  unpin: 'Bỏ ghim',

  // Tree Data
  treeDataGroupingHeaderName: 'Nhóm',
  treeDataExpand: 'mở rộng',
  treeDataCollapse: 'ẩn đi',

  // Grouping columns
  groupingColumnHeaderName: 'Nhóm',
  groupColumn: (name) => `Nhóm theo ${name}`,
  unGroupColumn: (name) => `Hủy nhóm theo ${name}`,

  // Master/detail
  detailPanelToggle: 'Ẩn/hiện chi tiết',
  expandDetailPanel: 'Mở rộng',
  collapseDetailPanel: 'Thu nhỏ',

  // Pagination
  paginationRowsPerPage: 'Số hàng mỗi trang:',
  // paginationDisplayedRows: ({
  //   from,
  //   to,
  //   count,
  //   estimated
  // }) => {
  //   if (!estimated) {
  //     return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  //   }
  //   const estimatedLabel = estimated && estimated > to ? `around ${estimated}` : `more than ${to}`;
  //   return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  // },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Tới trang đầu tiên';
    }
    if (type === 'last') {
      return 'Tới trang cuối cùng';
    }
    if (type === 'next') {
      return 'Tới trang tiếp theo';
    }
    // if (type === 'previous') {
    return 'Về trang trước đó';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Sắp xếp hàng',

  // Aggregation
  aggregationMenuItemHeader: 'Tổng hợp',
  aggregationFunctionLabelSum: 'Tổng',
  aggregationFunctionLabelAvg: 'Trung bình',
  aggregationFunctionLabelMin: 'Tối thiểu',
  aggregationFunctionLabelMax: 'Tối đa',
  aggregationFunctionLabelSize: 'Kích cỡ',

  // Pivot panel
  // pivotToggleLabel: 'Pivot',
  // pivotRows: 'Rows',
  // pivotColumns: 'Columns',
  // pivotValues: 'Values',
  // pivotCloseButton: 'Close pivot settings',
  // pivotSearchButton: 'Search fields',
  // pivotSearchControlPlaceholder: 'Search fields',
  // pivotSearchControlLabel: 'Search fields',
  // pivotSearchControlClear: 'Clear search',
  // pivotNoFields: 'No fields',
  // pivotMenuMoveUp: 'Move up',
  // pivotMenuMoveDown: 'Move down',
  // pivotMenuMoveToTop: 'Move to top',
  // pivotMenuMoveToBottom: 'Move to bottom',
  // pivotMenuRows: 'Rows',
  // pivotMenuColumns: 'Columns',
  // pivotMenuValues: 'Values',
  // pivotMenuOptions: 'Field options',
  // pivotMenuAddToRows: 'Add to Rows',
  // pivotMenuAddToColumns: 'Add to Columns',
  // pivotMenuAddToValues: 'Add to Values',
  // pivotMenuRemove: 'Remove',
  // pivotDragToRows: 'Drag here to create rows',
  // pivotDragToColumns: 'Drag here to create columns',
  // pivotDragToValues: 'Drag here to create values',
  // pivotYearColumnHeaderName: '(Year)',
  // pivotQuarterColumnHeaderName: '(Quarter)',

  // AI Assistant panel
  // aiAssistantPanelTitle: 'AI Assistant',
  // aiAssistantPanelNoHistory: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  // promptFieldLabel: 'Prompt',
  // promptFieldPlaceholder: 'Type a prompt…',
  // promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
  // promptFieldPlaceholderListening: 'Listening for prompt…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  // promptFieldSend: 'Send',
  // promptFieldRecord: 'Record',
  // promptFieldStopRecording: 'Stop recording',

  // Prompt
  // promptProcessingError: 'Could not process prompt',
  // promptRerun: 'Run again',
};

export const viVN: Localization = getGridLocalization(viVNGrid);
