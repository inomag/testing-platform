import { Validation } from 'src/@vymo/ui/atoms/input/types';

interface CommonAadharProps {
  otpValidation?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  onChange: ((...args) => void) | undefined;
  validations?: Validation[];
  subMessage?: React.ReactNode;
  classNames?: string | string[];
  'data-test-id'?: string;
  value?: string;
  label?: string;
  readOnly?: boolean;
  hideValidation?: boolean;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
}

interface AadharPropsWithoutModifier extends CommonAadharProps {
  displayModifier?: undefined;
  displayDeModifier?: undefined;
}

interface AadharPropsWithModifier extends CommonAadharProps {
  displayModifier: (arg0) => any;
  displayDeModifier: (arg0) => any;
}

export type AadharProps = AadharPropsWithModifier | AadharPropsWithoutModifier;
