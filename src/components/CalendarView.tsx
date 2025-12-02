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
      await new Promise(resolve => setTimeout(resolve, 100));

      // Step 2: Find ALL elements that need style changes
      const calendarContainer = calendarEl.querySelector('.calendar-container') as HTMLElement;
      const fcScrollers = calendarEl.querySelectorAll('.fc-scroller, .fc-scroller-liquid, .fc-scroller-liquid-absolute');
      const fcViewHarness = calendarEl.querySelector('.fc-view-harness') as HTMLElement;
      const fcView = calendarEl.querySelector('.fc-view') as HTMLElement;
      const wrapperEl = calendarEl as HTMLElement;

      if (!calendarContainer) {
        throw new Error('Calendar container not found');
      }

      // Step 3: Store original styles
      const savedStyles = {
        wrapper: {
          overflow: wrapperEl.style.overflow,
          height: wrapperEl.style.height,
          maxHeight: wrapperEl.style.maxHeight,
          position: wrapperEl.style.position,
        },
        container: {
          overflow: calendarContainer.style.overflow,
          height: calendarContainer.style.height,
          maxHeight: calendarContainer.style.maxHeight,
          flex: calendarContainer.style.flex,
        },
        viewHarness: fcViewHarness ? {
          overflow: fcViewHarness.style.overflow,
          height: fcViewHarness.style.height,
          maxHeight: fcViewHarness.style.maxHeight,
          position: fcViewHarness.style.position,
        } : null,
        fcView: fcView ? {
          overflow: fcView.style.overflow,
          height: fcView.style.height,
        } : null,
        scrollers: Array.from(fcScrollers).map(el => ({
          element: el as HTMLElement,
          overflow: (el as HTMLElement).style.overflow,
          height: (el as HTMLElement).style.height,
          maxHeight: (el as HTMLElement).style.maxHeight,
          position: (el as HTMLElement).style.position,
        }))
      };

      // Step 4: Expand wrapper
      wrapperEl.style.overflow = 'visible';
      wrapperEl.style.height = 'auto';
      wrapperEl.style.maxHeight = 'none';

      // Step 5: Expand container
      calendarContainer.style.overflow = 'visible';
      calendarContainer.style.height = 'auto';
      calendarContainer.style.maxHeight = 'none';
      calendarContainer.style.flex = 'none';

      // Step 6: Expand view harness
      if (fcViewHarness) {
        fcViewHarness.style.overflow = 'visible';
        fcViewHarness.style.height = 'auto';
        fcViewHarness.style.maxHeight = 'none';
        fcViewHarness.style.position = 'relative';
      }

      if (fcView) {
        fcView.style.overflow = 'visible';
        fcView.style.height = 'auto';
      }

      // Step 7: Expand all scrollers
      fcScrollers.forEach(scroller => {
        const el = scroller as HTMLElement;
        el.style.overflow = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
        el.style.position = 'relative';
      });

      // Wait for layout to stabilize
      await new Promise(resolve => setTimeout(resolve, 200));

      const isDark = document.documentElement.classList.contains('dark');

      // Step 8: Capture the calendar with full dimensions
      const canvas = await html2canvas(calendarEl, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        scale: 2,
        logging: false,
        width: calendarEl.scrollWidth,
        height: calendarEl.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      });

      // Step 10: Restore all original styles
      wrapperEl.style.overflow = savedStyles.wrapper.overflow;
      wrapperEl.style.height = savedStyles.wrapper.height;
      wrapperEl.style.maxHeight = savedStyles.wrapper.maxHeight;
      wrapperEl.style.position = savedStyles.wrapper.position;

      calendarContainer.style.overflow = savedStyles.container.overflow;
      calendarContainer.style.height = savedStyles.container.height;
      calendarContainer.style.maxHeight = savedStyles.container.maxHeight;
      calendarContainer.style.flex = savedStyles.container.flex;

      if (fcViewHarness && savedStyles.viewHarness) {
        fcViewHarness.style.overflow = savedStyles.viewHarness.overflow;
        fcViewHarness.style.height = savedStyles.viewHarness.height;
        fcViewHarness.style.maxHeight = savedStyles.viewHarness.maxHeight;
        fcViewHarness.style.position = savedStyles.viewHarness.position;
      }

      if (fcView && savedStyles.fcView) {
        fcView.style.overflow = savedStyles.fcView.overflow;
        fcView.style.height = savedStyles.fcView.height;
      }

      savedStyles.scrollers.forEach(({ element, overflow, height, maxHeight, position }) => {
        element.style.overflow = overflow;
        element.style.height = height;
        element.style.maxHeight = maxHeight;
        element.style.position = position;
      });

      // Restore event limit
      if (calendarApi && originalDayMaxEvents !== undefined) {
        calendarApi.setOption('dayMaxEvents', originalDayMaxEvents);
      }

      // Step 11: Download the image
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