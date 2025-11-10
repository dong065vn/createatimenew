import React from 'react';
import { Calendar, MapPin, Edit2, AlertTriangle, User } from 'lucide-react';
import type { ScheduleEvent } from '../types';
import { useScheduleStore } from '../store/scheduleStore';
import { Button } from './ui/Button';
import { useLanguageStore } from '../store/languageStore';

interface EventListItemProps {
  event: ScheduleEvent;
  isConflicting: boolean;
}

const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

export const EventListItem: React.FC<EventListItemProps> = ({ event, isConflicting }) => {
  const { t } = useLanguageStore();
  const setHoveredEventId = useScheduleStore((state) => state.setHoveredEventId);
  const setEditingEvent = useScheduleStore((state) => state.setEditingEvent);

  const duration = Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60)); // in minutes

  const itemClasses = `p-3 rounded-lg transition-colors duration-200 border-l-4 ${
    isConflicting
      ? 'bg-red-100/50 dark:bg-red-900/20'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
  }`;

  const itemStyle: React.CSSProperties = {
    borderColor: isConflicting ? '#ef4444' : (event.color || '#3b82f6'), // red-500 or custom color
  };


  return (
    <li
      className={itemClasses}
      style={itemStyle}
      onMouseEnter={() => setHoveredEventId(event.id)}
      onMouseLeave={() => setHoveredEventId(null)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            {isConflicting && (
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" aria-label="Conflicting event" />
            )}
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h4>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatTime(event.start)} - {formatTime(event.end)} ({duration} {t('eventList.minutes_short')})
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.instructor && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{event.instructor}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setEditingEvent(event)} aria-label="Edit event">
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
      {event.note && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2 bg-gray-50 dark:bg-gray-700/60 rounded-md">
          {event.note}
        </p>
      )}
    </li>
  );
};