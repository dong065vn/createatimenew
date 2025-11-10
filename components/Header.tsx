
import React from 'react';
import { ThemeToggle } from './ui/ThemeToggle';
import { FileImage, Upload } from 'lucide-react';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useLanguageStore } from '../store/languageStore';

interface HeaderProps {
  onNewUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewUpload }) => {
  const { t } = useLanguageStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileImage className="w-8 h-8 text-primary-600 dark:text-primary-500" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('header.title')}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onNewUpload}
            className="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('header.newUpload')}
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};