export type Validation = {
  regex: RegExp;
  errorMessage: string;
};

export type TextAreaProps = {
  label?: string;
  id?: string;
  validations?: Validation[];
  required?: boolean;
  onChange?: (
    val?,
    event?,
    additionalConfig?: any,
    isValid?: boolean,
    errors?: string[],
  ) => void;
  classNames?: string | string[];
  subMessage?: React.ReactNode;
  placeholder?: string;
  value?: string | number;
  'data-test-id'?: string;
  'data-index'?: number;
  hideValidation?: boolean;
  disabled?: boolean;
  onClick?: (event) => void;
  min?: number;
  max?: number;
  minLines?: number;
  charactersPerLine?: number;
  resize?: boolean;
  viewMode?: boolean;
};
