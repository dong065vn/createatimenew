// FIX: Implemented the missing HelpModal component to resolve module and syntax errors.
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { X, UploadCloud, MousePointerClick, CalendarDays } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguageStore();

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl bg-white dark:bg-gray-800 animate-in fade-in-90 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">{t('helpModal.title')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <p dangerouslySetInnerHTML={{ __html: t('helpModal.intro') }} />
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full">
                <UploadCloud className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('helpModal.step1_title')}</h3>
                <p>
                  {t('helpModal.step1_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full">
                <MousePointerClick className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('helpModal.step2_title')}</h3>
                <p>
                  {t('helpModal.step2_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full">
                <CalendarDays className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('helpModal.step3_title')}</h3>
                <p>
                  {t('helpModal.step3_desc')}
                </p>
              </div>
            </div>
          </div>
          
        </div>
        <div className="flex justify-end p-4 border-t dark:border-gray-700">
          <Button onClick={onClose}>{t('helpModal.close_button')}</Button>
        </div>
      </Card>
    </div>
  );
};