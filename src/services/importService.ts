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
    ocrConfidence: event.ocrConfidence ?? 1.0, // Default if not present
    boundingBox: event.boundingBox ?? { x: 0, y: 0, width: 0, height: 0 }, // Default if not present
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
          ocrConfidence: 1.0, // Default confidence for imported events
          boundingBox: { x: 0, y: 0, width: 0, height: 0 }, // No bounding box for imported events
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
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const hour = parseInt(dateStr.substring(9, 11));
  const minute = parseInt(dateStr.substring(11, 13));
  const second = parseInt(dateStr.substring(13, 15));

  return new Date(Date.UTC(year, month, day, hour, minute, second));
}
