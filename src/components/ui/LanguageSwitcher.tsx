import React from 'react';
import { useLanguageStore } from '../../store/languageStore';

export const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
      aria-label="Toggle language"
    >
      {language === 'en' ? 'VI' : 'EN'}
    </button>
  );
};
