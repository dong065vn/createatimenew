import type { ScheduleEvent } from '../types';

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function exportToICS(events: ScheduleEvent[]) {
  let icsContent = 'BEGIN:VCALENDAR\n';
  icsContent += 'VERSION:2.0\n';
  icsContent += 'PRODID:-//ScheduleFromImage//EN\n';

  events.forEach(event => {
    icsContent += 'BEGIN:VEVENT\n';
    icsContent += `UID:${event.id}@schedulefromimage.com\n`;
    icsContent += `DTSTAMP:${formatICSDate(new Date())}\n`;
    icsContent += `DTSTART:${formatICSDate(event.start)}\n`;
    icsContent += `DTEND:${formatICSDate(event.end)}\n`;
    icsContent += `SUMMARY:${event.title}\n`;
    if (event.location) {
      icsContent += `LOCATION:${event.location}\n`;
    }

    let description = '';
    if (event.instructor) {
        description += `Instructor: ${event.instructor}`;
    }
    if (event.note) {
        if (description) description += '\\n'; // Add newline if instructor is also present
        description += event.note;
    }
    if (description) {
        icsContent += `DESCRIPTION:${description.replace(/\n/g, '\\n')}\n`;
    }

    icsContent += 'END:VEVENT\n';
  });

  icsContent += 'END:VCALENDAR';

  downloadFile(icsContent, 'schedule.ics', 'text/calendar;charset=utf-8');
}

export function exportToJSON(events: ScheduleEvent[]) {
  const jsonContent = JSON.stringify(events, null, 2);
  downloadFile(jsonContent, 'schedule.json', 'application/json;charset=utf-8');
}

export function exportToTXT(events: ScheduleEvent[]) {
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  let txtContent = 'Schedule Events\r\n\r\n';

  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  sortedEvents.forEach(event => {
    txtContent += `Event: ${event.title}\r\n`;
    txtContent += `  - Time: ${event.start.toLocaleDateString('en-US')} ${formatTime(event.start)} - ${formatTime(event.end)}\r\n`;
    if (event.location) {
      txtContent += `  - Location: ${event.location}\r\n`;
    }
    if (event.instructor) {
      txtContent += `  - Instructor: ${event.instructor}\r\n`;
    }
    if (event.note) {
      txtContent += `  - Note: ${event.note}\r\n`;
    }
    txtContent += `\r\n`;
  });

  downloadFile(txtContent, 'schedule.txt', 'text/plain;charset=utf-8');
}


function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}