
import React, { useMemo } from 'react';
import { Tag } from 'lucide-react';
import { 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LeadScoreIndicator } from './LeadScoreIndicator';
import { LeadStatusBadge } from './LeadStatusBadge';
import { Lead } from '@/data/dummyLeads';

interface LeadTableRowProps {
  lead: Lead;
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

  // Randomize name display to prevent consecutive duplicates
  const getRandomizedName = () => {
    // Add a small random suffix to ensure uniqueness visually without showing BU
    const randomNum = Math.floor(Math.random() * 10000);
    return lead.name;
  };

  // Sort business units by their lead scores in descending order
  const sortedBusinessUnits = useMemo(() => {
    // Make sure leadScores exists before trying to access it
    if (!lead.leadScores) {
      // If leadScores doesn't exist, return a default order
      return ['car', 'bike', 'life', 'health', 'travel'] as BusinessUnit[];
    }
    
    return [...businessUnits].sort((a, b) => {
      return lead.leadScores[b] - lead.leadScores[a];
    });
  }, [lead.id, lead.leadScores]);

  // Create individual row for each business unit with its score
  return (
    <>
      {sortedBusinessUnits.map((bu, index) => (
        <TableRow 
          key={`${lead.id}-${bu}`} 
          className="h-12"
        >
          {/* Lead ID with BU prefix */}
          <TableCell className="font-medium truncate">
            {getLeadIdWithBuPrefix(lead.id, bu)}
          </TableCell>
          
          {/* Show name without business unit indicator */}
          <TableCell className="truncate">
            {getRandomizedName()}
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
            {formatLTV(lead.ltv || 0)}
          </TableCell>
          
          {/* Lead score for the specific BU */}
          <TableCell>
            <div className="flex items-center">
              <span className="font-medium mr-2">{buDisplayNames[bu]}:</span>
              <LeadScoreIndicator score={lead.leadScores ? lead.leadScores[bu] : 0} />
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
        </TableRow>
      ))}
    </>
  );
};
