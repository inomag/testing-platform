import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en';

export function i18nInitPromise() {
  return i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
      },
      fallbackLng: 'en',
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18next;
