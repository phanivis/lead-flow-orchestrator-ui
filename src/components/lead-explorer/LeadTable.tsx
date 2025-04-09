
import React from 'react';
import { 
  Table, 
  TableBody 
} from '@/components/ui/table';
import { LeadTableHeader } from './LeadTableHeader';
import { LeadTableRow } from './LeadTableRow';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  existingPolicyHolder: string;
  ltv: number;
  leadScores: {
    car: number;
    bike: number;
    life: number;
    health: number;
    travel: number;
  };
  status: string;
  lastActivity: string;
}

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
    <>
      <div className="flex justify-end mb-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={onOpenAssignDialog}
          disabled={selectedLeads.length === 0}
        >
          <UserPlus size={16} className="mr-2" />
          Assign Selected
        </Button>
      </div>
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
                <td colSpan={14} className="text-center py-6 text-gray-500">
                  No leads found matching your search.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
