export type TextProps = {
  bold?: boolean;
  semiBold?: boolean;
  medium?: boolean;
  regular?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?:
    | 'default'
    | 'h0'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'label'
    | 'sublabel'
    | 'subText'
    | 'description';
  link?: string;
  classNames?: string | string[];
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  'data-test-id'?: string;
};
