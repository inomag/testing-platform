export type IconProps = {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export interface ChipProps {
  type: 'success' | 'error' | 'info' | 'warning';
  iconProps?: IconProps;
  label: string;
  'data-test-id'?: string;
  classNames?: string | string[];
  bold?: boolean;
}
