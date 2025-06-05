import { ReactNode } from 'react';

export type Style = {
  [key: string]: string;
};

export type LoaderProps = BaseProps & {
  className?: string;
  visible?: boolean;
  /**
   * used to give icon indicator svg or react node
   */
  icon?: ReactNode;
  delay?: number;
  /**
   * used when we want to have fullPage loader. It will add background opacity by default
   */
  fullPage?: boolean;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
};

export type BaseProps = {
  height?: string | number;
  width?: string | number;
  color?: string;
};
