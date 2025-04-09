
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface IngestionFiltersProps {
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
}

const sources = [
  { value: 'all', label: 'All Sources' },
  { value: 'csv', label: 'CSV Upload' },
  { value: 'api', label: 'API' },
  { value: 'form', label: 'Form Submission' },
];

const IngestionFilters = ({ selectedSource, onSourceChange }: IngestionFiltersProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Select
        onValueChange={(value) => onSourceChange(value === 'all' ? null : value)}
        defaultValue="all"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sources.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default IngestionFilters;
