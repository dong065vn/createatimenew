import React, { useState, useEffect } from 'react';
import type { ScheduleEvent } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface EditEventModalProps {
  event: ScheduleEvent;
  onClose: () => void;
  onSave: (updatedData: Partial<ScheduleEvent>) => void;
}

const formatDateForInput = (date: Date) => {
    // Use local time instead of UTC to prevent timezone shift
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose, onSave }) => {
  const { t } = useLanguageStore();
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location || '');
  const [instructor, setInstructor] = useState(event.instructor || '');
  const [note, setNote] = useState(event.note || '');
  const [start, setStart] = useState(formatDateForInput(event.start));
  const [end, setEnd] = useState(formatDateForInput(event.end));
  const [color, setColor] = useState(event.color || '#3b82f6'); // Default to primary blue
  const [error, setError] = useState<string | null>(null);

  // Clear error when user modifies inputs
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [title, start, end]);

  const handleSave = () => {
    // Validate title
    if (!title.trim()) {
      setError(t('editModal.error_title_required'));
      return;
    }

    // Validate start < end
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate >= endDate) {
      setError(t('editModal.error_time_invalid'));
      return;
    }

    onSave({
      title,
      location,
      instructor,
      note,
      start: startDate,
      end: endDate,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">{t('editModal.title')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_title')}</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent"
              />
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_color')}</label>
              <input
                type="color"
                id="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-1 bg-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_start')}</label>
              <input
                type="datetime-local"
                id="start"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_end')}</label>
              <input
                type="datetime-local"
                id="end"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent dark:[color-scheme:dark]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_location')}</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent"
              />
            </div>
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_instructor')}</label>
              <input
                type="text"
                id="instructor"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('editModal.field_note')}</label>
            <textarea
              id="note"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end p-4 border-t dark:border-gray-700 gap-3">
          <Button variant="outline" onClick={onClose}>{t('editModal.cancel')}</Button>
          <Button onClick={handleSave}>{t('editModal.save')}</Button>
        </div>
      </Card>
    </div>
  );
};