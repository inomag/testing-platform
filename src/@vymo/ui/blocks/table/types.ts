type Pagination = {
  visible: boolean;
  currentPage?: number;
  pageSize?: number;
};

export type TableFilter = {
  column: string;
  type: string;
};

type TableConfig = {
  showSearch?: boolean;
  hideEmpty?: boolean;
  hideFilters?: boolean;
  filters?: TableFilter[];
  pagination?: Pagination;
  onRowSelect?: (selectedRows: any) => void;
  isRowSelectionEnabled?: boolean;
  selectionAttribute?: string;
  fetchData?: (...args) => any;
  fetchSize?: number;
  visualizedRows?: boolean;
  name: string | React.ReactElement;
  selections?: any;
};
export type ColumnConfig = {
  visible?: any;
  name?: string;
  title: string;
  field: string;
  type: string;
  canSort?: boolean;
  defaultSort?: 'asc' | 'desc' | '' | string;
};
export interface TableProps {
  tableData: any;
  tableConfig?: TableConfig;
  columnConfigs: ColumnConfig[];
  sortOn?: {
    column: string;
    defaultSort?: 'asc' | 'desc';
  };
  onSort?: any;
  onRowSelect?: any;
  classNames?: any;
  'data-test-id'?: string;
  groupFilterValues?: any;
  groupGlobalFilter?: string;
  expandTable?: boolean;
}
