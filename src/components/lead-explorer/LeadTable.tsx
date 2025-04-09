
import React, { useState } from 'react';
import { 
  Table, 
  TableBody 
} from '@/components/ui/table';
import { LeadTableHeader } from './LeadTableHeader';
import { LeadTableRow } from './LeadTableRow';
import { Lead } from '@/data/dummyLeads';

interface LeadTableProps {
  leads: Lead[];
  filteredLeads: Lead[];
  onOpenAssignDialog: () => void;
}

export const LeadTable = ({
  leads,
  filteredLeads,
  onOpenAssignDialog
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

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="w-full overflow-auto whitespace-nowrap">
        <Table>
          <LeadTableHeader 
            hasLeads={leads.length > 0}
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
