
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

export const ScoringTableEmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
        No scoring rules found.
      </TableCell>
    </TableRow>
  );
};
