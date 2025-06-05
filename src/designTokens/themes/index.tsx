import { themes } from './constants';
import { AppliedTheme } from './types';
import { getTheme } from './utils';

const clientCurrentTheme = { variables: {}, config: {} };

export const initialiseTheme = () => {
  const appTheme = themes[window.portalId || window.APP];
  const root = document.querySelector(':root') as HTMLElement;

  if (appTheme) {
    Object.entries(appTheme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
      clientCurrentTheme.variables[key] = value;
    });
    Object.entries(appTheme.config).forEach(([key, value]) => {
      clientCurrentTheme.config[key] = value;
    });
  }

  const mode = getTheme();
  document.documentElement.setAttribute('data-theme', mode);
};

export const getAppTheme = () => clientCurrentTheme as AppliedTheme;
