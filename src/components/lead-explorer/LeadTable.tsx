
import React, { useState } from 'react';
import { 
  Table, 
  TableBody 
} from '@/components/ui/table';
import { LeadTableHeader } from './LeadTableHeader';
import { LeadTableRow } from './LeadTableRow';
import { Lead } from '@/data/dummyLeads';
import { Badge } from '@/components/ui/badge';
import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadTableProps {
  leads: Lead[];
  filteredLeads: Lead[];
  onOpenAssignDialog: () => void;
  onOpenFilterDialog?: () => void;
}

export const LeadTable = ({
  leads,
  filteredLeads,
  onOpenAssignDialog,
  onOpenFilterDialog
}: LeadTableProps) => {
  // Default widths for columns (percentages)
  const [columnWidths, setColumnWidths] = useState({
    leadId: 10, 
    name: 12,
    email: 15,
    city: 8,
    policyHolder: 8,
    ltv: 9,
    leadScore: 10,
    status: 8,
    lastActivity: 8,
    tags: 7,
    actions: 5
  });

  // Sort state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const isFiltered = filteredLeads.length !== leads.length;

  return (
    <div className="border rounded-md overflow-hidden">
      {isFiltered && (
        <div className="bg-muted/30 p-2 flex items-center justify-between border-b">
          <div className="flex items-center">
            <Badge variant="secondary" className="mr-2">Filtered</Badge>
            <span className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
            </span>
          </div>
          {onOpenFilterDialog && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenFilterDialog}
              className="h-8"
            >
              <FilterX className="h-4 w-4 mr-1" />
              Modify Filters
            </Button>
          )}
        </div>
      )}
      <div className="w-full overflow-auto whitespace-nowrap">
        <Table>
          <LeadTableHeader 
            hasLeads={leads.length > 0}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <LeadTableRow 
                  key={lead.id} 
                  lead={lead}
                  columnWidths={columnWidths}
                />
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-500">
                  No leads found matching your search.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
