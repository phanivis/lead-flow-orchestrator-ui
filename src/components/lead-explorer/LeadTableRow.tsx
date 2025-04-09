
import React from 'react';
import { Edit } from 'lucide-react';
import { 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LeadScoreIndicator } from './LeadScoreIndicator';
import { LeadStatusBadge } from './LeadStatusBadge';
import { sampleCampaigns } from '@/data/assignmentData';
import { Lead } from '@/data/dummyLeads';

interface LeadTableRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelectLead: (leadId: string, checked: boolean) => void;
}

export const LeadTableRow = ({ 
  lead, 
  isSelected, 
  onSelectLead 
}: LeadTableRowProps) => {
  const formatLTV = (ltv: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(ltv);
  };

  const assignedCampaign = lead.assignedCampaign 
    ? sampleCampaigns.find(campaign => campaign.id === lead.assignedCampaign)
    : null;

  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelectLead(lead.id, checked as boolean)}
        />
      </TableCell>
      <TableCell className="font-medium">{lead.name}</TableCell>
      <TableCell>{lead.email}</TableCell>
      <TableCell>{lead.city}</TableCell>
      <TableCell>
        <Badge className={lead.existingPolicyHolder === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {lead.existingPolicyHolder}
        </Badge>
      </TableCell>
      <TableCell>{formatLTV(lead.ltv)}</TableCell>
      
      <TableCell className="p-2">
        <LeadScoreIndicator score={lead.leadScores.car} />
      </TableCell>
      
      <TableCell className="p-2">
        <LeadScoreIndicator score={lead.leadScores.bike} />
      </TableCell>
      
      <TableCell className="p-2">
        <LeadScoreIndicator score={lead.leadScores.life} />
      </TableCell>
      
      <TableCell className="p-2">
        <LeadScoreIndicator score={lead.leadScores.health} />
      </TableCell>
      
      <TableCell className="p-2">
        <LeadScoreIndicator score={lead.leadScores.travel} />
      </TableCell>
      
      <TableCell>
        <LeadStatusBadge status={lead.status} />
      </TableCell>
      <TableCell>{lead.lastActivity}</TableCell>
      <TableCell>
        {assignedCampaign ? (
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
            {assignedCampaign.name}
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">Not assigned</span>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
            <DropdownMenuItem>Change Status</DropdownMenuItem>
            <DropdownMenuItem>Assign Owner</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
