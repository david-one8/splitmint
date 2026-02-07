'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Participant } from '@/lib/types';

interface SearchFiltersProps {
  participants: Participant[];
  onFilterChange: (filters: {
    search: string;
    participant: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export default function SearchFilters({ participants, onFilterChange }: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [participant, setParticipant] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleChange = (field: string, value: string) => {
    const newFilters = { search, participant, dateFrom, dateTo, [field]: value };
    
    if (field === 'search') setSearch(value);
    if (field === 'participant') setParticipant(value);
    if (field === 'dateFrom') setDateFrom(value);
    if (field === 'dateTo') setDateTo(value);
    
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search expenses..."
            className="pl-10"
          />
        </div>
        
        <Select
          value={participant}
          onChange={(e) => handleChange('participant', e.target.value)}
          options={[
            { value: '', label: 'All Participants' },
            ...participants.map(p => ({ value: p.id, label: p.name }))
          ]}
        />
        
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => handleChange('dateFrom', e.target.value)}
          placeholder="From date"
        />
        
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => handleChange('dateTo', e.target.value)}
          placeholder="To date"
        />
      </div>
    </div>
  );
}
