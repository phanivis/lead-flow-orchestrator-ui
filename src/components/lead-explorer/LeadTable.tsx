
import React from 'react';
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
  selectedLeads: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectLead: (leadId: string, checked: boolean) => void;
  onOpenAssignDialog: () => void;
}

export const LeadTable = ({
  leads,
  filteredLeads,
  selectedLeads,
  onSelectAll,
  onSelectLead,
  onOpenAssignDialog
}: LeadTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <LeadTableHeader 
          onSelectAll={onSelectAll} 
          allLeadsSelected={selectedLeads.length === leads.length}
          hasLeads={leads.length > 0}
        />
        <TableBody>
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <LeadTableRow 
                key={lead.id} 
                lead={lead} 
                isSelected={selectedLeads.includes(lead.id)}
                onSelectLead={onSelectLead}
              />
            ))
          ) : (
            <tr>
              <td colSpan={15} className="text-center py-6 text-gray-500">
                No leads found matching your search.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
