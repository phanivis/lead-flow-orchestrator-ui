
import React from 'react';
import { Edit, Tag } from 'lucide-react';
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
import { Lead } from '@/data/dummyLeads';

interface LeadTableRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelectLead: (leadId: string, checked: boolean) => void;
  columnWidths: Record<string, number>;
}

// Define business units
const businessUnits = ['car', 'bike', 'life', 'health', 'travel'] as const;
type BusinessUnit = typeof businessUnits[number];

// Map business units to their display names
const buDisplayNames: Record<BusinessUnit, string> = {
  car: 'Car',
  bike: 'Bike',
  life: 'Life',
  health: 'Health',
  travel: 'Travel'
};

export const LeadTableRow = ({ 
  lead, 
  isSelected, 
  onSelectLead,
  columnWidths
}: LeadTableRowProps) => {
  const formatLTV = (ltv: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(ltv);
  };

  // Generate a display-friendly Lead ID with BU prefix
  const getLeadIdWithBuPrefix = (leadId: string, bu: BusinessUnit) => {
    return `${bu.toUpperCase()}-${leadId}`;
  };

  // Determine tags for the lead
  const getTags = () => {
    const tags = [];
    
    // Example logic for tag assignment
    if (lead.lastActivity && new Date(lead.lastActivity) > new Date('2025-04-05')) {
      tags.push('Calling');
    }
    
    if (lead.status === 'Hot Lead' || lead.status === 'Qualified') {
      tags.push('Comms');
    }
    
    return tags;
  };

  const tags = getTags();

  // Create individual row for each business unit with its score
  return (
    <>
      {businessUnits.map((bu, index) => (
        <TableRow 
          key={`${lead.id}-${bu}`} 
          className="h-12"
        >
          {/* Checkbox column - only show checkbox in first row */}
          <TableCell className="p-2">
            {index === 0 && (
              <Checkbox 
                checked={isSelected}
                onCheckedChange={(checked) => onSelectLead(lead.id, checked as boolean)}
              />
            )}
          </TableCell>
          
          {/* Lead ID with BU prefix */}
          <TableCell className="font-medium truncate">
            {getLeadIdWithBuPrefix(lead.id, bu)}
          </TableCell>
          
          {/* Show name in all rows */}
          <TableCell className="truncate">
            {lead.name}
          </TableCell>
          
          {/* Show email in all rows */}
          <TableCell className="truncate">
            {lead.email}
          </TableCell>
          
          {/* Show city in all rows */}
          <TableCell className="truncate">
            {lead.city}
          </TableCell>
          
          {/* Show existing policy holder in all rows */}
          <TableCell>
            <Badge className={lead.existingPolicyHolder === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {lead.existingPolicyHolder}
            </Badge>
          </TableCell>
          
          {/* Show LTV in all rows */}
          <TableCell className="truncate">
            {formatLTV(lead.ltv)}
          </TableCell>
          
          {/* Lead score for the specific BU */}
          <TableCell>
            <div className="flex items-center">
              <span className="font-medium mr-2">{buDisplayNames[bu]}:</span>
              <LeadScoreIndicator score={lead.leadScores[bu]} />
            </div>
          </TableCell>
          
          {/* Show status in all rows */}
          <TableCell>
            <LeadStatusBadge status={lead.status} />
          </TableCell>
          
          {/* Show last activity in all rows */}
          <TableCell className="truncate">
            {lead.lastActivity}
          </TableCell>
          
          {/* Tags column */}
          <TableCell>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-purple-50 border-purple-200 text-purple-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </TableCell>
          
          {/* Actions column */}
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
      ))}
    </>
  );
};
