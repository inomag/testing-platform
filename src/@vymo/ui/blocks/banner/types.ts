export type BannerProps = {
  title?: string | JSX.Element;
  children?: string | JSX.Element;
  icon?: JSX.Element;
  closeable?: boolean;
  duration?: number;
  classNames?: string | string[];
  variant?: 'success' | 'warning' | 'info' | 'error';
  'data-test-id'?: string;
};
