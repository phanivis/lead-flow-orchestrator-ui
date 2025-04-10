
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter } from 'lucide-react';

interface LeadIngestionHeaderProps {
  onCreateRule: () => void;
  onSearch: (query: string) => void;
  onFilter: () => void;
}

export const LeadIngestionHeader = ({ 
  onCreateRule, 
  onSearch,
  onFilter
}: LeadIngestionHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lead Qualification Rules</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage rules to automatically qualify leads based on user behavior
          </p>
        </div>
        <Button onClick={onCreateRule} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Rule
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search rules..." 
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={onFilter} className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
};
