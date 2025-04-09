
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { ScoringRule, BusinessUnit } from '@/types/scoringTypes';
import { ScoringTableHeader } from './ScoringTableHeader';
import { ScoringTableRow } from './ScoringTableRow';
import { ScoringTableEmptyState } from './ScoringTableEmptyState';
import { useScoringTableSort } from './useScoringTableSort';

interface ScoringRulesTableProps {
  rules: ScoringRule[];
  businessUnits: BusinessUnit[];
  onEdit: (rule: ScoringRule) => void;
  onDelete: (ruleId: string) => void;
}

export const ScoringRulesTable = ({ 
  rules, 
  businessUnits, 
  onEdit, 
  onDelete 
}: ScoringRulesTableProps) => {
  const { sortField, sortDirection, handleSort, sortedRules } = useScoringTableSort(rules, businessUnits);
  
  return (
    <Table>
      <ScoringTableHeader 
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <TableBody>
        {sortedRules.length === 0 ? (
          <ScoringTableEmptyState />
        ) : (
          sortedRules.map(rule => (
            <ScoringTableRow
              key={rule.id}
              rule={rule}
              businessUnits={businessUnits}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};
