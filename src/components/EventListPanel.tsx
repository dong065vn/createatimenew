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
    <Card className="h-full flex flex-col shadow-xl rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-750">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
          {t('eventList.title')} <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 ml-2 text-sm font-semibold bg-primary-600 text-white rounded-full shadow-md">{events.length}</span>
        </h2>
      </div>
      <div className="p-4">
        <EventFilter searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      </div>
       {conflictingEventIds.length > 0 && (
        <div className="px-4 pb-3 text-sm text-red-700 dark:text-red-300 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 mx-4 mb-2 p-3 rounded-lg border border-red-200 dark:border-red-800 animate-slide-in">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="font-semibold">{t('eventList.conflicts_detected', { count: conflictingEventIds.length })}</span>
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        {sortedEvents.length > 0 ? (
          <ul className="space-y-3">
            {sortedEvents.map((event, index) => (
              <li key={event.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <EventListItem
                  event={event}
                  isConflicting={conflictingEventIds.includes(event.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4 opacity-30">📅</div>
            <p className="text-lg font-medium">{searchTerm ? t('eventList.no_events_match') : t('eventList.no_events_found')}</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
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
            className="flex-1 sm:flex-initial"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('eventList.import')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => exportToICS(events)} disabled={events.length === 0} className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            {t('eventList.export_ics')}
          </Button>
          <Button variant="outline" onClick={() => exportToJSON(events)} disabled={events.length === 0} className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            {t('eventList.export_json')}
          </Button>
          <Button variant="outline" onClick={() => exportToTXT(events)} disabled={events.length === 0} className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            {t('eventList.export_txt')}
          </Button>
           <Button variant="secondary" className="sm:hidden text-xs" onClick={reset}>
              <Upload className="w-3 h-3 mr-1" />
              {t('eventList.new')}
            </Button>
        </div>
      </div>
    </Card>
  );
};