import { create } from 'zustand';
import en from '../locales/en';
import vi from '../locales/vi';

type Language = 'en' | 'vi';

const translations = { en, vi };

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const getInitialLanguage = (): Language => {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'vi') {
        return storedLang;
    }
    return 'en'; // Default to English
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
  toggleLanguage: () => {
    const newLang = get().language === 'en' ? 'vi' : 'en';
    localStorage.setItem('language', newLang);
    set({ language: newLang });
  },
  t: (key, replacements) => {
    const lang = get().language;
    const langTranslations = translations[lang];
    
    const keys = key.split('.');
    let result: any = langTranslations;
    
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        result = fallbackResult || key;
        break;
      }
    }

    if (typeof result === 'string' && replacements) {
        Object.keys(replacements).forEach(placeholder => {
            result = result.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
        });
    }

    return result || key;
  },
}));
