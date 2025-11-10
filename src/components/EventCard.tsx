import React from 'react';
import type { EventContentArg } from '@fullcalendar/core';
import type { ScheduleEvent } from '../types';

interface EventCardProps {
  eventInfo: EventContentArg;
}

const formatEventTime = (date: Date | null) => {
  if (!date) return '';
  // Display time in 24-hour format (e.g., 14:30)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Lightens a hex color by a given percentage.
 * @param hex The hex color string (e.g., '#RRGGBB').
 * @param percent The percentage to lighten (0-100).
 * @returns The new hex color string.
 */
const lightenColor = (hex: string, percent: number): string => {
    if (!hex || !hex.startsWith('#')) return '#dbeafe'; // Fallback to primary-100
    let [r, g, b] = hex.slice(1).match(/.{1,2}/g)!.map(c => parseInt(c, 16));
    const factor = percent / 100;
    r = Math.min(255, Math.floor(r + (255 - r) * factor));
    g = Math.min(255, Math.floor(g + (255 - g) * factor));
    b = Math.min(255, Math.floor(b + (255 - b) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Darkens a hex color by a given percentage.
 * @param hex The hex color string (e.g., '#RRGGBB').
 * @param percent The percentage to darken (0-100).
 * @returns The new hex color string.
 */
const darkenColor = (hex: string, percent: number): string => {
    if (!hex || !hex.startsWith('#')) return '#1e40af'; // Fallback to primary-800
    let [r, g, b] = hex.slice(1).match(/.{1,2}/g)!.map(c => parseInt(c, 16));
    const factor = 1 - percent / 100;
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}


/**
 * Custom component for rendering events within FullCalendar.
 * Matches the UI design provided in the image with specific colors and layout.
 */
export const EventCard: React.FC<EventCardProps> = ({ eventInfo }) => {
  const event = eventInfo.event.extendedProps as ScheduleEvent;
  const isConflict = event.hasConflict;

  const baseClasses = 'h-full p-2 text-xs overflow-hidden flex flex-col w-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm';

  if (isConflict) {
    // For conflicts, we use a simpler, high-contrast style to draw attention with animation
    const conflictStyle = 'bg-gradient-to-br from-red-50 to-red-100 text-red-900 border-l-4 border-red-500 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-100 dark:border-red-400 animate-pulse-subtle';
    return (
      <div className={`${baseClasses} ${conflictStyle}`}>
          <div className="font-bold truncate text-sm mb-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            {eventInfo.event.title}
          </div>
          <div className="opacity-90 font-medium">{formatEventTime(eventInfo.event.start)}</div>
          {event.location && (
              <div className="opacity-80 truncate text-[10px] mt-0.5">
                  📍 {event.location}
              </div>
          )}
          {event.instructor && (
            <div className="opacity-80 truncate text-[10px]">👤 {event.instructor}</div>
          )}
      </div>
    );
  }

  const baseColor = event.color || '#3b82f6'; // Default to primary-500

  const customStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${lightenColor(baseColor, 90)} 0%, ${lightenColor(baseColor, 80)} 100%)`,
    borderLeft: `4px solid ${baseColor}`,
    boxShadow: `0 2px 4px ${baseColor}20`,
  };

  const titleStyle: React.CSSProperties = {
    color: darkenColor(baseColor, 20),
    fontWeight: 600,
  };
  const detailsStyle: React.CSSProperties = {
    color: darkenColor(baseColor, 10),
  };

  return (
    <div style={customStyle} className={baseClasses}>
        <div style={titleStyle} className="truncate text-sm mb-1 leading-tight">{eventInfo.event.title}</div>
        <div style={detailsStyle} className="font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full opacity-60" style={{backgroundColor: baseColor}}></span>
          {formatEventTime(eventInfo.event.start)}
        </div>
        {event.location && (
            <div style={detailsStyle} className="truncate text-[10px] mt-0.5 opacity-80">
                📍 {event.location}
            </div>
        )}
        {event.instructor && (
            <div style={detailsStyle} className="truncate text-[10px] opacity-80">
                👤 {event.instructor}
            </div>
        )}
    </div>
  );
};