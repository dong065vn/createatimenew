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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      {/* Left Controls */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={onPrev}
            className="px-3 py-2 bg-primary-700 text-white rounded-l-md hover:bg-primary-800 transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="px-3 py-2 bg-primary-700 text-white rounded-r-md hover:bg-primary-800 transition-colors"
            aria-label="Next period"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-semibold capitalize bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors dark:bg-primary-800/60 dark:text-primary-100 dark:hover:bg-primary-800"
        >
          {t('calendarHeader.today')}
        </button>
      </div>

      {/* Center Title */}
      <h2 className="text-2xl font-semibold order-first sm:order-none text-gray-800 dark:text-gray-100 whitespace-nowrap">
        {title}
      </h2>

      {/* Right Controls */}
      <div className="flex items-center w-full sm:w-auto justify-end gap-2">
        <div className="flex items-center bg-primary-800 rounded-lg p-1 w-full sm:w-auto justify-center">
          {viewOptions.map(option => {
             const isActive = view === option.key;
            return (
              <button
                key={option.key}
                onClick={() => onViewChange(option.key)}
                className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors capitalize w-full ${
                  isActive
                    ? 'bg-primary-600 text-white shadow'
                    : 'text-primary-200 hover:bg-primary-700'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={onDownloadImage}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          aria-label={t('calendarHeader.download_image_label')}
        >
          <Camera className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
};