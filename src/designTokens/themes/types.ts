type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;
export type BrandKeys =
  | '--brand-primary'
  | '--color-brand-100'
  | '--color-brand-200'
  | '--color-brand-300'
  | '--color-brand-400'
  | '--color-brand-500'
  | '--color-brand-600'
  | '--color-brand-700'
  | '--color-brand-800'
  | '--color-brand-900'
  | '--color-brand-1000';
export type Theme = {
  variables: Record<BrandKeys, Color>;
  config: {
    loader?: string;
  };
};

export type AppliedTheme = {
  variables: Record<keyof Theme['variables'], Color>;
  config: Theme['config'];
};
