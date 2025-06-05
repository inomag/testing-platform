import { ReactNode } from 'react';
import { InputFieldConfig } from 'src/@vymo/ui/molecules/form/types';

export type AifProps = {
  inputFields: Array<InputFieldConfig>;
  children: ReactNode | null;
  groupTitle: string;
  addActionTitle: string;
  disabled: boolean;
  minGroup: number;
  maxGroup: number;
  required: boolean;
  code: string;
  hint: string;
  onChange: (arg0, arg1?, arg2?) => void;
  appendFieldsAtCode: () => void;
  value: number;
  'data-test-id'?: string;
  viewMode?: boolean;
};
