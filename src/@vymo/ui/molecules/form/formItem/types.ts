import { JSXElementConstructor, ReactElement } from 'react';

export type FormulaValidation = {
  expression: any;
  error_message: string;
  disable_backend_validation: boolean;
};
export type Validation = {
  regex: RegExp;
  errorMessage: string;
};

export type FormItemProps = {
  onChange?: Function;
  label?: string;
  tooltip?: string;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  validations?: Validation[] | FormulaValidation[];
  field?: any;
  code: string;
  type?: string;
  required?: boolean;
  verified?: boolean | null;
  classNames?: string | string[];
  'data-test-id'?: string;
  isDateRange?: boolean;
  value?: any;
  hidden?: boolean;
  min?: null | number;
  max?: null | number;
  additionalData?: any;
  legacy?: boolean;
  hint?: string;
};
