import v1Tokens from '../cssVariablesLegacy.json';
import variableMapping from '../tokenMapping.json';
import { Color } from './types';

export const updateAppTheme = (newTheme): void => {
  if (newTheme && Object.keys(newTheme).length > 0) {
    Object.keys(newTheme)?.forEach((property) => {
      if (newTheme[property]) {
        document.documentElement.style.setProperty(
          property,
          newTheme[property],
        );
      }
    });
  }
};

export const applyV1TokensToRoot = () => {
  const root = document.querySelector(':root') as HTMLElement;
  Object.entries(variableMapping).forEach(([v2TokenKey, v1TokenKey]) => {
    const tokenValue = v1Tokens[v1TokenKey];

    if (tokenValue) {
      root.style.setProperty(v2TokenKey, tokenValue);
    }
  });
};

export const hexToRGBA = (hex: string, factor: number = 1): Color => {
  // Remove leading "#"
  hex = hex.replace(/^#/, '');

  // Expand shorthand hex (e.g. "f03") to full form ("ff0033")
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error('Invalid HEX color');
  }

  const scale = (channel: string): number => {
    const value = parseInt(channel, 16);

    if (factor < 1) {
      // Lighten: move toward 255
      return Math.round(value + (255 - value) * (1 - factor));
    }
    // Darken: scale down
    return Math.round(value / factor);
  };

  const r = scale(hex.substring(0, 2));
  const g = scale(hex.substring(2, 4));
  const b = scale(hex.substring(4, 6));

  return `rgb(${r}, ${g}, ${b})` as Color;
};

export const getBrandRootVariables = (brandColor: string = '#b2182b') => {
  const rootVariables = {
    '--brand-primary': hexToRGBA(brandColor),
    '--color-brand-100': hexToRGBA(brandColor, 0.1),
    '--color-brand-200': hexToRGBA(brandColor, 0.2),
    '--color-brand-300': hexToRGBA(brandColor, 0.3),
    '--color-brand-400': hexToRGBA(brandColor, 0.4),
    '--color-brand-500': hexToRGBA(brandColor, 0.5),
    '--color-brand-600': hexToRGBA(brandColor, 0.6),
    '--color-brand-700': hexToRGBA(brandColor, 0.8),
    '--color-brand-800': hexToRGBA(brandColor, 1),
    '--color-brand-900': hexToRGBA(brandColor, 1.1),
    '--color-brand-1000': hexToRGBA(brandColor, 1.2),
  };

  return rootVariables;
};

export const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

export const getTheme = (): 'dark' | 'light' =>
  (localStorage.getItem('theme') as 'dark' | 'light') || 'light';
