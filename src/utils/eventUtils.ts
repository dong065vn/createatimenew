import type { ScheduleEvent } from '../types';

/**
 * Checks for overlapping time intervals.
 * @param start1 - Start of the first interval.
 * @param end1 - End of the first interval.
 * @param start2 - Start of the second interval.
 * @param end2 - End of the second interval.
 * @returns True if the intervals overlap, false otherwise.
 */
const intervalsOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  // Overlap exists if one interval starts before the other ends, and vice-versa.
  return start1 < end2 && start2 < end1;
};

/**
 * Identifies events that have time conflicts with other events.
 * @param events - An array of ScheduleEvent objects.
 * @returns An array containing the IDs of all events that have a time conflict.
 */
export function getConflictingEventIds(events: ScheduleEvent[]): string[] {
  const conflictingIds = new Set<string>();

  if (events.length < 2) {
    return [];
  }
  
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];
      
      if (intervalsOverlap(event1.start, event1.end, event2.start, event2.end)) {
        conflictingIds.add(event1.id);
        conflictingIds.add(event2.id);
      }
    }
  }

  return Array.from(conflictingIds);
}
