export type AlertProps = {
  title?: string | JSX.Element;
  icon?: JSX.Element;
  closeable?: boolean;
  duration?: null | number;
  classNames?: string | string[];
  variant?: 'success' | 'warning' | 'info' | 'error' | 'default' | undefined;
  banner?: boolean;
  outlined?: boolean;
  'data-test-id'?: string;
  onClose?: () => void;
};
