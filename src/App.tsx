
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useScheduleStore } from './store/scheduleStore';
import { processImage } from './services/geminiService';
import { useTheme } from './hooks/useTheme';
import { useLanguageStore } from './store/languageStore';

import { Header } from './components/Header';
import { ImageViewPanel } from './components/ImageViewPanel';
import { EventListPanel } from './components/EventListPanel';
import { CalendarView } from './components/CalendarView';
import { Spinner } from './components/ui/Spinner';
import { Alert } from './components/ui/Alert';
import { EditEventModal } from './components/EditEventModal';
import { Button } from './components/ui/Button';
import { HelpModal } from './components/HelpModal';
import { HelpCircle, UploadCloud } from 'lucide-react';

const App: React.FC = () => {
  useTheme();
  const { t, language } = useLanguageStore();
  const { 
    imageUrl, setImageUrl, 
    events, setEvents, 
    isLoading, setLoading, 
    error, setError,
    hoveredEventId,
    editingEvent, setEditingEvent, updateEvent,
    loadDemoData, reset
  } = useScheduleStore();

  const [isHelpOpen, setHelpOpen] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setLoading(true);
      setError(null);
      setImageUrl(URL.createObjectURL(file));
      try {
        const extractedEvents = await processImage(file, language);
        setEvents(extractedEvents);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        // Don't clear image url on error, so user can see what they uploaded.
        // Let reset handle cleanup.
      }
    }
  }, [setLoading, setImageUrl, setEvents, setError, language]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });
  
  const handleEditSave = (updatedData: Partial<typeof events[0]>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, updatedData);
    }
  };

  // Show help modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setHelpOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  if (!imageUrl || error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col">
         <Header onNewUpload={reset} />
         <main {...getRootProps()} className="flex-grow flex flex-col items-center justify-center p-4 text-center">
            <input {...getInputProps()} />

            <div className="max-w-2xl w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 md:p-16 transition-colors duration-300 flex flex-col items-center justify-center space-y-6 bg-white dark:bg-gray-800/50">
              {isLoading ? (
                <>
                  <Spinner />
                  <p className="text-xl font-semibold">{t('home.analyzing')}</p>
                  <p className="text-gray-500 dark:text-gray-400">{t('home.analyzing_subtext')}</p>
                </>
              ) : (
                <>
                    <UploadCloud className="w-16 h-16 text-primary-500" />
                    <h2 className="text-2xl md:text-3xl font-bold">{t('home.upload_title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {isDragActive ? t('home.upload_prompt_active') : t('home.upload_prompt')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button onClick={open} size="lg">
                           <UploadCloud className="w-5 h-5 mr-2"/> {t('home.select_image')}
                        </Button>
                        <Button onClick={() => loadDemoData(language)} variant="secondary" size="lg">
                           {t('home.try_demo')}
                        </Button>
                    </div>
                </>
              )}
            </div>
            {error && (
                <div className="mt-6 max-w-2xl w-full">
                    <Alert variant="danger" title={t('home.processing_failed')}>
                        <p>{error}</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
                            {t('home.try_again')}
                        </Button>
                    </Alert>
                </div>
            )}
         </main>
         <footer className="text-center p-4 text-sm text-gray-500">
           {t('footer.powered_by')} {t('footer.need_help')}{' '}
           <button onClick={() => setHelpOpen(true)} className="underline hover:text-primary-500 ml-1">{t('footer.click_here')}</button>
         </footer>
         <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 flex flex-col">
      <Header onNewUpload={reset} />
      <main className="flex-grow container mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-[calc(100vh-68px)] overflow-auto">
        <div className="lg:col-span-4 h-full min-h-[400px] lg:min-h-0 animate-fade-in">
            <EventListPanel />
        </div>
        <div className="lg:col-span-8 h-full grid grid-rows-1 lg:grid-rows-2 gap-4 sm:gap-6 animate-fade-in-delayed">
          <div className="row-span-1 min-h-[300px] lg:min-h-0">
            <ImageViewPanel imageUrl={imageUrl} />
          </div>
          <div className="row-span-1 min-h-[500px] lg:min-h-0">
            <CalendarView />
          </div>
        </div>
      </main>
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleEditSave}
        />
      )}
       <button
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-2xl shadow-2xl z-50 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-primary-500/50"
        aria-label="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};

export default App;