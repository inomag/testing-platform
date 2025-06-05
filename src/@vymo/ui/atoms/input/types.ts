export type Validation = {
  regex: RegExp;
  errorMessage: string;
};

export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel';

export type IconPosition = 'left' | 'right';

export type InputProps = {
  label?: string;
  type?: InputType;
  id?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
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
  clearInputIcon?: boolean;
  isOnChangeArgFirstEvent?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  displayModifier?: (arg0) => any;
  displayDeModifier?: (arg0) => any;
  size?: number;
  showDisabledIcon?: boolean;
  loading?: boolean;
  // block can show input data but not editable. Can be used in cases like select, timepicker where user input is taken from optionList.
  variant?: 'input' | 'block' | 'custom';
  renderInputBase?: JSX.Element;
  secureValue?: boolean;
  showSecureValueIcon?: boolean;
  onKeyDown?: (event) => void;
  onMouseDown?: (event) => void;
  onFocus?: (event) => void;
  onBlur?: (event) => void;
  onPaste?: (event) => void;
  onTouchStart?: (event) => void;
  tag?: {
    variant: 'default' | 'success' | 'error' | 'warning' | null;
    text: string;
  } | null;
  viewMode?: boolean;
};
