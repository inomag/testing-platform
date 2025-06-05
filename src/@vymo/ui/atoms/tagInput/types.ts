import { SyntheticEvent } from 'react';
import type { InputProps } from 'src/@vymo/ui/atoms/input/types';

export type Option = {
  editorProps?: Object;
  label?: string;
  subLabel?: string;
  value?: string;
  name?: string;
  code?: string;
  displayPrefix?: string;
  icon?: any;
  disabled?: boolean;
  options?: Array<Option>;
};

export type Props = Omit<InputProps, 'value' | 'onChange'> & {
  value: Option[];
  onChange?: (value: Option[], event: SyntheticEvent) => void;
  showInput?: boolean;
  onInputChange?: (value: string) => void;
  createTagOnEnter?: boolean;
  maxTagCount?: false | number;
  viewMode?: boolean;
};
