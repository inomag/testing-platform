import { Theme } from './types';
import { getBrandRootVariables } from './utils';

export const themes: Record<string, Theme> = {
  frontendBoard: {
    variables: {
      ...getBrandRootVariables('#0D9488'),
    },
    config: {
      loader: 'dots',
    },
  },
};
