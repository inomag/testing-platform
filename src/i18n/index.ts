import { TOptions } from 'i18next';
import i18next from './i18next';

export const locale = (key: string, options?: TOptions) =>
  i18next.t(key, options);

export const changeLanguage = (lang: string) => i18next.changeLanguage(lang);

export const getCurrentLanguage = (): string =>
  i18next.language ?? i18next.resolvedLanguage ?? 'en';
