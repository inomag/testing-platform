export type ReferralDropdownProps = {
  type: string;
  code: string;
  value: string;
  disabled: boolean;
  onChange: (arg0: string, event, arg2) => void;
  online: boolean;
  source: string;
  context_filters?: Array<any>;
  customFilters?: Array<{ value: string[]; path: string }>;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};
