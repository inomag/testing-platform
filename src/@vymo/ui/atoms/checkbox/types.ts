export type CheckboxGroupProps = {
  onChange?: (selectedValues: string[], event: any) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  value?: string[];
  classNames?: string | string[];
  size?: 'small' | 'medium' | 'large';
  'data-test-id'?: string;
};

export type CheckboxProps = {
  id?: string;
  onChange?: (checked: boolean, value: string, event: any) => void;
  label?: string | React.ReactNode;
  value: boolean | string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  'data-test-id'?: string;
  className?: string;
  indeterminate?: boolean;
};
