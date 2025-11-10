// FIX: Implemented the missing EventFilter component to resolve module errors.
import React from 'react';
import { Input } from './ui/Input';
import { Search } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface EventFilterProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({ searchTerm, onSearchTermChange }) => {
  const { t } = useLanguageStore();
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder={t('eventList.search_placeholder')}
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
};