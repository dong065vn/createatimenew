// FIX: Removed self-import of 'BoundingBox' to resolve the name conflict error.

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  instructor?: string; // Optional property for the instructor's name
  note?: string;
  ocrConfidence: number;
  boundingBox: BoundingBox;
  hasConflict?: boolean; // Optional property for conflict detection
  color?: string; // Optional property for custom event color
}