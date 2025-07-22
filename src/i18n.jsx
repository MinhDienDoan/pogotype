import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      fr: fr,
      de: de,
      it: it,
      es: es,
      'pt-BR': ptBR
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React handles escaping
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // Persist language in localStorage
      lookupLocalStorage: 'i18nextLng' // Key for storing language
    }
  });

export default i18n;
