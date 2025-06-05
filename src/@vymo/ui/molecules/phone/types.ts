import type { CountryCode } from 'libphonenumber-js';

export type Props = {
  disabled?: boolean;
  value: string;
  countryCallingCode?: CountryCode;
  countryCodesFilter?: Array<string>;
  onChange: (arg0: string, arg1: string, arg2?) => void;
  'data-test-id'?: string;
  viewMode: boolean;
  locale?: string;
  placeholder?: string;
  selectedCountryCode?: string;
};
