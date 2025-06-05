export type SwitchProps = {
  value: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  onChange: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  classNames?: string | string[];
  'data-test-id'?: string;
};
