
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ScoringRule } from '@/types/scoringTypes';

interface ScoringTableHeaderProps {
  sortField: keyof ScoringRule;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof ScoringRule) => void;
}

export const ScoringTableHeader: React.FC<ScoringTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  const getSortIcon = (field: keyof ScoringRule) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer" 
          onClick={() => onSort('business_unit')}
        >
          Business Unit {getSortIcon('business_unit')}
        </TableHead>
        <TableHead 
          className="cursor-pointer" 
          onClick={() => onSort('description')}
        >
          Description {getSortIcon('description')}
        </TableHead>
        <TableHead 
          className="cursor-pointer" 
          onClick={() => onSort('weight')}
        >
          Weight {getSortIcon('weight')}
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
