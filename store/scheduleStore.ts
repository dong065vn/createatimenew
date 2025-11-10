import { create } from 'zustand';
import type { ScheduleEvent } from '../types';
import { DEMO_IMAGE_URL, getDemoEvents } from '../constants';

interface ScheduleState {
  events: ScheduleEvent[];
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  hoveredEventId: string | null;
  editingEvent: ScheduleEvent | null;
  setEvents: (events: ScheduleEvent[]) => void;
  setImageUrl: (url: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateEvent: (eventId: string, updatedData: Partial<ScheduleEvent>) => void;
  setHoveredEventId: (eventId: string | null) => void;
  setEditingEvent: (event: ScheduleEvent | null) => void;
  loadDemoData: (language: 'en' | 'vi') => void;
  reset: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  events: [],
  imageUrl: null,
  isLoading: false,
  error: null,
  hoveredEventId: null,
  editingEvent: null,
  setEvents: (events) => {
    set({ events, error: null, isLoading: false });
  },
  setImageUrl: (url) => set({ imageUrl: url }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  updateEvent: (eventId, updatedData) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId ? { ...event, ...updatedData } : event
      )
    }));
  },
  setHoveredEventId: (eventId) => set({ hoveredEventId: eventId }),
  setEditingEvent: (event) => set({ editingEvent: event }),
  loadDemoData: (language) => {
      set({
        imageUrl: DEMO_IMAGE_URL,
        events: getDemoEvents(language),
        isLoading: false,
        error: null,
      });
  },
  reset: () => {
    // Revoke object URL if it exists to prevent memory leaks
    const currentUrl = get().imageUrl;
    if (currentUrl && currentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }
    set({ events: [], imageUrl: null, isLoading: false, error: null, hoveredEventId: null, editingEvent: null });
  }
}));