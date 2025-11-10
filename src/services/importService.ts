import type { ScheduleEvent } from '../types';

export async function importFromJSON(file: File): Promise<ScheduleEvent[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON format. Expected an array of events.');
  }

  return data.map((event: any) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
}

export async function importFromICS(file: File): Promise<ScheduleEvent[]> {
  const text = await file.text();
  const events: ScheduleEvent[] = [];

  const lines = text.split(/\r?\n/);
  let currentEvent: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.start && currentEvent.end && currentEvent.title) {
        events.push({
          id: currentEvent.id || `imported-${Date.now()}-${Math.random()}`,
          title: currentEvent.title,
          start: currentEvent.start,
          end: currentEvent.end,
          location: currentEvent.location,
          note: currentEvent.note,
          instructor: currentEvent.instructor,
        });
      }
      currentEvent = null;
    } else if (currentEvent) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':');

      if (key.startsWith('UID')) {
        currentEvent.id = value.split('@')[0];
      } else if (key.startsWith('DTSTART')) {
        currentEvent.start = parseICSDate(value);
      } else if (key.startsWith('DTEND')) {
        currentEvent.end = parseICSDate(value);
      } else if (key === 'SUMMARY') {
        currentEvent.title = value;
      } else if (key === 'LOCATION') {
        currentEvent.location = value;
      } else if (key === 'DESCRIPTION') {
        const desc = value.replace(/\\n/g, '\n');
        const instructorMatch = desc.match(/Instructor:\s*(.+?)(?:\n|$)/);
        if (instructorMatch) {
          currentEvent.instructor = instructorMatch[1].trim();
          currentEvent.note = desc.replace(/Instructor:\s*.+?(?:\n|$)/, '').trim();
        } else {
          currentEvent.note = desc;
        }
      }
    }
  }

  if (events.length === 0) {
    throw new Error('No valid events found in ICS file.');
  }

  return events;
}

function parseICSDate(dateStr: string): Date {
  // Handle format: 20231201T140000Z
  const year = parseInt(dateStr.substr(0, 4));
  const month = parseInt(dateStr.substr(4, 2)) - 1;
  const day = parseInt(dateStr.substr(6, 2));
  const hour = parseInt(dateStr.substr(9, 2));
  const minute = parseInt(dateStr.substr(11, 2));
  const second = parseInt(dateStr.substr(13, 2));

  return new Date(Date.UTC(year, month, day, hour, minute, second));
}
