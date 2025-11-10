import React, { useState, useMemo, useRef } from 'react';
import { useScheduleStore } from '../store/scheduleStore';
import { Card } from './ui/Card';
import { EventListItem } from './EventListItem';
import { EventFilter } from './EventFilter';
import { Download, Upload, AlertTriangle, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { exportToICS, exportToJSON, exportToTXT } from '../services/exportService';
import { importFromJSON, importFromICS } from '../services/importService';
import { getConflictingEventIds } from '../utils/eventUtils';
import { useLanguageStore } from '../store/languageStore';

export const EventListPanel: React.FC = () => {
  const { t } = useLanguageStore();
  const events = useScheduleStore((state) => state.events);
  const setEvents = useScheduleStore((state) => state.setEvents);
  const reset = useScheduleStore((state) => state.reset);
  const [searchTerm, setSearchTerm] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  const conflictingEventIds = useMemo(() => getConflictingEventIds(events), [events]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let importedEvents;
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.json')) {
        importedEvents = await importFromJSON(file);
      } else if (fileName.endsWith('.ics')) {
        importedEvents = await importFromICS(file);
      } else {
        alert(t('eventList.import_error_format') || 'Unsupported file format. Please use JSON or ICS files.');
        return;
      }

      setEvents(importedEvents);
      alert(t('eventList.import_success', { count: importedEvents.length }) || `Successfully imported ${importedEvents.length} events.`);
    } catch (error) {
      alert(t('eventList.import_error') || `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events;
    const lowercasedTerm = searchTerm.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowercasedTerm) ||
        event.location?.toLowerCase().includes(lowercasedTerm) ||
        event.note?.toLowerCase().includes(lowercasedTerm)
    );
  }, [events, searchTerm]);
  
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [filteredEvents]);

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">{t('eventList.title')} ({events.length})</h2>
      </div>
      <div className="p-3">
        <EventFilter searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      </div>
       {conflictingEventIds.length > 0 && (
        <div className="px-3 pb-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{t('eventList.conflicts_detected', { count: conflictingEventIds.length })}</span>
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-3">
        {sortedEvents.length > 0 ? (
          <ul className="space-y-3">
            {sortedEvents.map((event) => (
              <EventListItem 
                key={event.id} 
                event={event} 
                isConflicting={conflictingEventIds.includes(event.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>{searchTerm ? t('eventList.no_events_match') : t('eventList.no_events_found')}</p>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept=".json,.ics"
            onChange={handleImport}
            className="hidden"
            id="import-file-input"
          />
          <Button
            variant="outline"
            onClick={() => importInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('eventList.import')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => exportToICS(events)} disabled={events.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            {t('eventList.export_ics')}
          </Button>
          <Button variant="outline" onClick={() => exportToJSON(events)} disabled={events.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            {t('eventList.export_json')}
          </Button>
          <Button variant="outline" onClick={() => exportToTXT(events)} disabled={events.length === 0}>
            <FileText className="w-4 h-4 mr-2" />
            {t('eventList.export_txt')}
          </Button>
           <Button variant="secondary" className="sm:hidden" onClick={reset}>
              <Upload className="w-4 h-4 mr-2" />
              {t('eventList.new')}
            </Button>
        </div>
      </div>
    </Card>
  );
};