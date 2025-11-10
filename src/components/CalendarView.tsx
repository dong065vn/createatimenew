import React, { useMemo, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useScheduleStore } from '../store/scheduleStore';
import { useLanguageStore } from '../store/languageStore';
import type { EventDropArg, EventClickArg, ViewApi } from '@fullcalendar/core';
import { Card } from './ui/Card';
import { EventCard } from './EventCard';
import { getConflictingEventIds } from '../utils/eventUtils';
import { CalendarHeader } from './CalendarHeader';

type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

export const CalendarView: React.FC = () => {
  const { t } = useLanguageStore();
  const events = useScheduleStore((state) => state.events);
  const updateEvent = useScheduleStore((state) => state.updateEvent);
  const setEditingEvent = useScheduleStore((state) => state.setEditingEvent);
  
  const calendarApiRef = useRef<FullCalendar>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  
  const [calendarTitle, setCalendarTitle] = useState('');
  const [currentView, setCurrentView] = useState<CalendarViewType>('dayGridMonth');

  const conflictingEventIds = useMemo(() => getConflictingEventIds(events), [events]);

  const handleEventDrop = useCallback((arg: EventDropArg) => {
    const { event } = arg;
    if (event.start && event.end) {
      updateEvent(event.id, { start: event.start, end: event.end });
    }
  }, [updateEvent]);

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const clickedEvent = events.find(e => e.id === arg.event.id);
    if (clickedEvent) {
        setEditingEvent(clickedEvent);
    }
  }, [events, setEditingEvent]);

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

  const handleDownloadImage = useCallback(async () => {
    const calendarEl = calendarWrapperRef.current;
    if (!calendarEl || !(window as any).html2canvas) {
      console.error("Calendar element not found or html2canvas script not loaded.");
      return;
    }

    try {
      // Find all scrollable elements within the calendar
      const scrollableElements = calendarEl.querySelectorAll('.fc-scroller');
      const originalStyles: { element: Element; overflow: string; height: string; maxHeight: string }[] = [];

      // Store original styles and temporarily adjust for full capture
      scrollableElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalStyles.push({
          element: el,
          overflow: htmlEl.style.overflow,
          height: htmlEl.style.height,
          maxHeight: htmlEl.style.maxHeight,
        });

        // Temporarily adjust styles to show all content
        htmlEl.style.overflow = 'visible';
        htmlEl.style.height = 'auto';
        htmlEl.style.maxHeight = 'none';
      });

      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the calendar
      const canvas = await (window as any).html2canvas(calendarEl, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        windowWidth: calendarEl.scrollWidth,
        windowHeight: calendarEl.scrollHeight,
        onclone: (clonedDoc: Document) => {
          // Ensure all content is visible in the clone
          const clonedCalendar = clonedDoc.querySelector('.fc');
          if (clonedCalendar) {
            const clonedScrollers = clonedCalendar.querySelectorAll('.fc-scroller');
            clonedScrollers.forEach((scroller) => {
              const htmlScroller = scroller as HTMLElement;
              htmlScroller.style.overflow = 'visible';
              htmlScroller.style.height = 'auto';
              htmlScroller.style.maxHeight = 'none';
            });
          }
        }
      });

      // Restore original styles
      originalStyles.forEach(({ element, overflow, height, maxHeight }) => {
        const htmlEl = element as HTMLElement;
        htmlEl.style.overflow = overflow;
        htmlEl.style.height = height;
        htmlEl.style.maxHeight = maxHeight;
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `calendar-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Failed to capture calendar:", error);
      alert(t('calendarHeader.download_error'));
    }
  }, [t]);

  const calendarEvents = useMemo(() => events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      ...event,
      hasConflict: conflictingEventIds.includes(event.id)
    },
  })), [events, conflictingEventIds]);

  return (
    <Card ref={calendarWrapperRef} className="h-full flex flex-col overflow-hidden shadow-xl rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <CalendarHeader
          title={calendarTitle}
          view={currentView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
          onDownloadImage={handleDownloadImage}
        />
      <div className="flex-grow calendar-container px-4 pb-4 transition-all duration-300">
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
          eventClassNames="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
          dayMaxEvents={3}
          moreLinkClick="popover"
          nowIndicator={true}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          expandRows={true}
        />
      </div>
    </Card>
  );
};