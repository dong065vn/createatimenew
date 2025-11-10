import React, { useMemo, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useScheduleStore } from '../store/scheduleStore';
import type { EventDropArg, EventClickArg, ViewApi } from '@fullcalendar/core';
import { Card } from './ui/Card';
import { EventCard } from './EventCard';
import { getConflictingEventIds } from '../utils/eventUtils';
import { CalendarHeader } from './CalendarHeader';

type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

export const CalendarView: React.FC = () => {
  const events = useScheduleStore((state) => state.events);
  const updateEvent = useScheduleStore((state) => state.updateEvent);
  const setEditingEvent = useScheduleStore((state) => state.setEditingEvent);
  
  const calendarApiRef = useRef<FullCalendar>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  
  const [calendarTitle, setCalendarTitle] = useState('');
  const [currentView, setCurrentView] = useState<CalendarViewType>('dayGridMonth');

  const conflictingEventIds = useMemo(() => getConflictingEventIds(events), [events]);

  const handleEventDrop = (arg: EventDropArg) => {
    const { event } = arg;
    if (event.start && event.end) {
      updateEvent(event.id, { start: event.start, end: event.end });
    }
  };

  const handleEventClick = (arg: EventClickArg) => {
    const clickedEvent = events.find(e => e.id === arg.event.id);
    if (clickedEvent) {
        setEditingEvent(clickedEvent);
    }
  };

  const handleDatesSet = useCallback((viewInfo: { view: ViewApi }) => {
    setCalendarTitle(viewInfo.view.title);
    setCurrentView(viewInfo.view.type as CalendarViewType);
  }, []);

  const handlePrev = useCallback(() => calendarApiRef.current?.getApi().prev(), []);
  const handleNext = useCallback(() => calendarApiRef.current?.getApi().next(), []);
  const handleToday = useCallback(() => calendarApiRef.current?.getApi().today(), []);
  const handleViewChange = useCallback((view: CalendarViewType) => {
    calendarApiRef.current?.getApi().changeView(view);
  }, []);

  const handleDownloadImage = useCallback(() => {
    const calendarEl = calendarWrapperRef.current;
    if (calendarEl && (window as any).html2canvas) {
      (window as any).html2canvas(calendarEl, {
        useCORS: true,
        // Set background color based on theme to avoid transparent backgrounds on capture
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff', // gray-800 or white
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `schedule-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    } else {
        console.error("Calendar element not found or html2canvas script not loaded.");
    }
  }, []);

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      ...event,
      hasConflict: conflictingEventIds.includes(event.id)
    },
  }));

  return (
    <Card ref={calendarWrapperRef} className="h-full flex flex-col overflow-hidden">
        <CalendarHeader 
          title={calendarTitle}
          view={currentView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
          onDownloadImage={handleDownloadImage}
        />
      <div className="flex-grow calendar-container px-4 pb-4">
        <FullCalendar
          ref={calendarApiRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          events={calendarEvents}
          editable={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => <EventCard eventInfo={eventInfo} />}
          height="100%"
          datesSet={handleDatesSet}
        />
      </div>
    </Card>
  );
};