import { ReactNode } from 'react';

export type RadioButtonProps = {
  id?: string;
  name?: string;
  value: string;
  label: string | ReactNode;
  checked?: boolean;
  onChange?: (
    value: Option[],
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  disabled?: boolean;
  className?: string;
  'data-test-id'?: string;
  radioDivClasses?: string;
  variant?: 'primary' | 'filled';
};

export type Option = {
  value?: string;
  label?: string | ReactNode;
  code: string;
  name: string;
  disabled?: boolean;
};

export type RadioTypeProps = 'radio' | 'tabs' | 'chipRadio';

export type RadioGroupProps = {
  name?: string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (
    value: Option[],
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  disabled?: boolean;
  classNames?: string;
  type?: RadioTypeProps;
  variant?: 'primary' | 'filled';
  options?: any;
  'data-test-id'?: string;
  viewMode?: boolean;
};
