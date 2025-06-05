import { MutableRefObject, SyntheticEvent } from 'react';

export type SelectProps = {
  'data-test-id'?: string;
  placeholder?: string;
  options?: Array<Option>;
  value?: Array<string | number> | string;
  expandedNodesLevel?: number;
  multi?: boolean;
  search?: boolean;
  onChange?: (arg0: Array<Option>, event: SyntheticEvent) => void;
  disabled?: boolean;
  onSearchInputChange?: (arg0: string) => void;
  optionsListLoading?: boolean;
  loading?: boolean;
  clearInputIcon?: boolean;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
  classNames?: string;
};

export type Option = {
  editorProps?: Object;
  label?: string;
  subLabel?: string;
  value?: string;
  name?: string;
  code?: string;
  displayPrefix?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  options?: Array<Option>;
};

export type OptionsListProps = {
  'data-test-id': string;
  style?: Object;
  options: Array<Option>;
  onItemClick: (arg0: Option, event: SyntheticEvent) => void;
  isSelected?: (arg0: Option) => boolean;
  expandedNodesLevel?: number;
  isSearch: boolean;
  inputRef: React.RefObject<HTMLElement>;
  searchRef?: MutableRefObject<HTMLElement>;
  showMenu: boolean;
  showNoData?: boolean;
  optionsListLoading?: boolean;
  loading?: boolean;
  onSearchInputChange: (arg0: string) => void;
  isMulti: boolean;
};

export type FlatOptions = Array<
  Option & {
    depth?: number;
    id?: string;
    hasChildren?: boolean;
    collapsed?: boolean;
    editorProps?: Object;
  }
>;
