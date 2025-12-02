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
    const html2canvas = (window as any).html2canvas;

    if (!calendarEl || !html2canvas) {
      console.error("Calendar element or html2canvas not available");
      return;
    }

    try {
      // Step 1: Show all events by removing limit
      const calendarApi = calendarApiRef.current?.getApi();
      const originalDayMaxEvents = calendarApi?.getOption('dayMaxEvents');
      calendarApi?.setOption('dayMaxEvents', false);

      // Wait for calendar to re-render with all events
      await new Promise(resolve => requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      }));

      // Step 2: Find and prepare elements for capture
      const calendarContainer = calendarEl.querySelector('.calendar-container') as HTMLElement;
      const fcScrollers = calendarEl.querySelectorAll('.fc-scroller');
      const todayCells = calendarEl.querySelectorAll('.fc-day-today');

      if (!calendarContainer) {
        throw new Error('Calendar container not found');
      }

      // Step 3: Store original styles (only what we need)
      const savedStyles = {
        container: {
          overflow: calendarContainer.style.overflow,
          height: calendarContainer.style.height,
        },
        scrollers: Array.from(fcScrollers).map(el => ({
          element: el as HTMLElement,
          overflow: (el as HTMLElement).style.overflow,
          height: (el as HTMLElement).style.height,
          maxHeight: (el as HTMLElement).style.maxHeight,
        })),
        todayCells: Array.from(todayCells).map(el => ({
          element: el as HTMLElement,
          background: (el as HTMLElement).style.background,
          animation: (el as HTMLElement).style.animation,
        }))
      };

      // Step 4: Expand to show all content
      calendarContainer.style.overflow = 'visible';
      calendarContainer.style.height = 'auto';

      fcScrollers.forEach(scroller => {
        const el = scroller as HTMLElement;
        el.style.overflow = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      });

      // Step 5: Fix today cells - remove animation and set solid background for capture
      const isDark = document.documentElement.classList.contains('dark');
      todayCells.forEach(cell => {
        const el = cell as HTMLElement;
        el.style.animation = 'none';
        el.style.background = isDark 
          ? 'rgba(59, 130, 246, 0.15)' // Subtle blue for dark mode
          : 'rgba(59, 130, 246, 0.1)'; // Subtle blue for light mode
      });

      // Wait for layout to stabilize
      await new Promise(resolve => requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      }));

      // Step 6: Capture the calendar
      const canvas = await html2canvas(calendarEl, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        scale: 2,
        logging: false,
        windowWidth: calendarEl.scrollWidth,
        windowHeight: calendarEl.scrollHeight,
      });

      // Step 7: Restore all original styles
      calendarContainer.style.overflow = savedStyles.container.overflow;
      calendarContainer.style.height = savedStyles.container.height;

      savedStyles.scrollers.forEach(({ element, overflow, height, maxHeight }) => {
        element.style.overflow = overflow;
        element.style.height = height;
        element.style.maxHeight = maxHeight;
      });

      savedStyles.todayCells.forEach(({ element, background, animation }) => {
        element.style.background = background;
        element.style.animation = animation;
      });

      // Restore event limit
      if (calendarApi && originalDayMaxEvents !== undefined) {
        calendarApi.setOption('dayMaxEvents', originalDayMaxEvents);
      }

      // Step 8: Download the image
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