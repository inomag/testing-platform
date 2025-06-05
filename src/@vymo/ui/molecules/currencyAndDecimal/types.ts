export type Validation = {
  regex: RegExp;
  errorMessage: string;
};
export type CurrencyAndDecimalInputProps = {
  code: string;
  onChange: (
    arg0: string,
    event,
    additionalData?: any,
    validValue?: boolean,
    error?: string[],
  ) => void;
  disabled?: boolean;
  value?: number;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  isCurrency: boolean;
  validations?: Validation[];
  hideValidation?: boolean;
  'data-test-id'?: string;
  currencySymbol?: string;
  currencyIso?: string;
  locale?: string;
  viewMode?: boolean;
};
