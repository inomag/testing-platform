export type ButtonType = 'primary' | 'outlined' | 'link' | 'text';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xLarge';

export type LinkProps = {
  href?: string;
  target?: string;
  rel?: string;
};

export type IconProps = {
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export type ButtonVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'filled'
  | 'subtle';

export type ButtonProps = {
  type?: ButtonType;
  size?: ButtonSize;
  rounded?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  onClick?: (arg0) => void;
  onMouseDown?: (arg0) => void;
  linkProps?: LinkProps;
  iconProps?: IconProps;
  className?: string;
  loading?: boolean;
  [key: `data-${string}`]: string;
};
