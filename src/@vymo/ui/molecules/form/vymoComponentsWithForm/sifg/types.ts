import type { Option } from 'src/@vymo/ui/atoms/select/types';

export type SifgProps = {
  code: string;
  value: string;
  disabled: boolean;
  options: {
    selection: {
      type: 'code_name_spinner';
      code: string;
      hint: string;
      required: true;
      code_name_spinner_options: Array<Option>;
    };
    inputs: Record<string, Object>;
  };
  placeholder: string;
  outputType?: { json?: boolean; returnCode?: boolean };
  onChange: (arg0: string, event, arg2?) => void;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};
