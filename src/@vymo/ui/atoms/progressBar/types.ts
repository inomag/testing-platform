export enum Type {
  Line = 'line',
  Circle = 'circle',
}

export type Size = 'small' | 'medium' | 'large';

export type ProgressBarProps = {
  strokeColor?: string;
  value: number;
  maxValue?: number;
  info?: (val: number, maxVal: number) => string | false;
  trailColor?: string;
  type?: Type;
  steps?: number;
  size?: Size;
  classNames?: string | string[];
  showText?: boolean;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'filled';
  strokeRadius?: boolean;
};

export type Variant = 'success' | 'warning' | 'info' | 'error' | 'filled';

export type ProgressBarChildProps = {
  value: number;
  maxValue: number;
  info: (val: number, maxVal: number) => string | false;
  strokeColor?: string;
  trailColor: string;
  steps: number;
  classNames?: string | string[];
  getStatusIcon: (statusType: Variant | undefined) => React.ReactNode;
  size: Size;
  showText?: boolean;
  variant?: Variant;
  strokeRadius?: boolean;
};
