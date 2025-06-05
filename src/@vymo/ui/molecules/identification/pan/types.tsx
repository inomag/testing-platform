import { Validation } from 'src/@vymo/ui/atoms/input/types';

interface CommonPanProps {
  otpValidation?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  onChange: ((...arg) => void) | undefined;
  validations?: Validation[];
  subMessage?: React.ReactNode;
  classes?: string | string[];
  value?: string;
  label?: string;
  readOnly?: boolean;
  hideValidation?: boolean;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
}

interface PanPropsWithoutModifier extends CommonPanProps {
  displayModifier?: undefined;
  displayDeModifier?: undefined;
}

interface PanPropsWithModifier extends CommonPanProps {
  displayModifier: (arg0) => any;
  displayDeModifier: (arg0) => any;
}

export type PanProps = PanPropsWithModifier | PanPropsWithoutModifier;
