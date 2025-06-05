export type Props = {
  value: string;
  disabled: boolean;
  onChange: (arg0, arg1, arg2?) => void;
  placeholder: string;
  options: Array<{ code: string; name: string }>;
  type: string;
  returnCode: boolean;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};
