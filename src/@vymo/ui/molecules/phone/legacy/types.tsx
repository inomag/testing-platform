import type { Country } from 'react-phone-number-input';
import {
  IconPosition,
  InputType,
  Validation,
} from 'src/@vymo/ui/atoms/input/types';

export interface IPhoneInputProps {
  label?: string;
  type?: InputType;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
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
  displayModifier?: undefined | ((arg0) => any);
  subMessage?: React.ReactNode;
  placeholder?: string;
  value?: string;
  min?: number;
  max?: number;
  defaultCountryCode?: Country;
  'data-test-id'?: string;
  readOnly?: boolean;
  onCountryChange?: (arg0) => void;
  countries?: Country[];
  showCountrySelect?: boolean;
  locale?: string;
}

export type PhoneInputProps = IPhoneInputProps;
