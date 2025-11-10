import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

interface CalendarHeaderProps {
  title: string;
  view: CalendarViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
  onDownloadImage: () => void;
}

/**
 * A custom header component for the FullCalendar instance, styled to match the provided UI design.
 * @param {CalendarHeaderProps} props The props for the component.
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onDownloadImage,
}) => {
  const { t } = useLanguageStore();

  const viewOptions = useMemo(() => [
    { key: 'dayGridMonth' as CalendarViewType, label: t('calendarHeader.month') },
    { key: 'timeGridWeek' as CalendarViewType, label: t('calendarHeader.week') },
    { key: 'timeGridDay' as CalendarViewType, label: t('calendarHeader.day') },
  ], [t]);


  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
      {/* Left Controls */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
        <div className="inline-flex rounded-xl shadow-md bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700" role="group">
          <button
            onClick={onPrev}
            className="px-3 py-2 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Previous period"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="px-3 py-2 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm ml-1"
            aria-label="Next period"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onToday}
          className="px-5 py-2.5 text-sm font-semibold capitalize bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-700 transform hover:scale-105 active:scale-95"
        >
          {t('calendarHeader.today')}
        </button>
      </div>

      {/* Center Title */}
      <h2 className="text-2xl sm:text-3xl font-bold order-first sm:order-none bg-gradient-to-r from-primary-700 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
        {title}
      </h2>

      {/* Right Controls */}
      <div className="flex items-center w-full sm:w-auto justify-end gap-3">
        <div className="flex items-center bg-gradient-to-br from-primary-700 to-primary-800 dark:from-primary-600 dark:to-primary-700 rounded-xl p-1.5 w-full sm:w-auto justify-center shadow-md border border-primary-800 dark:border-primary-700">
          {viewOptions.map(option => {
             const isActive = view === option.key;
            return (
              <button
                key={option.key}
                onClick={() => onViewChange(option.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                  isActive
                    ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 shadow-lg transform scale-105'
                    : 'text-white/80 hover:text-white hover:bg-primary-600/50 dark:hover:bg-primary-600/50 transform hover:scale-102'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={onDownloadImage}
          className="p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-700 transform hover:scale-110 active:scale-95"
          aria-label={t('calendarHeader.download_image_label')}
        >
          <Camera className="w-5 h-5 text-primary-700 dark:text-primary-400" />
        </button>
      </div>
    </div>
  );
};