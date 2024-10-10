import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationTA from './locales/ta/translation.json';

// Language resources
const resources = {
  en: {
    translation: translationEN,
  },
  ta: {
    translation: translationTA,
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector) // Automatically detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
