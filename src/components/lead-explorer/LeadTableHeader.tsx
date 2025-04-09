
import React from 'react';
import { 
  TableHead,
  TableRow,
  TableHeader
} from '@/components/ui/table';
import { Tag, ArrowUp, ArrowDown } from 'lucide-react';

interface LeadTableHeaderProps {
  hasLeads: boolean;
  onSort?: (field: string) => void;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc';
}

export const LeadTableHeader = ({ 
  hasLeads,
  onSort,
  sortField,
  sortDirection = 'asc'
}: LeadTableHeaderProps) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  const getSortableHeaderProps = (field: string) => {
    if (!onSort) return {};
    return {
      className: `w-[${field === 'leadId' ? '10%' : field === 'name' ? '12%' : field === 'email' ? '15%' : '8%'}] cursor-pointer hover:bg-gray-50`,
      onClick: () => onSort(field)
    };
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead {...getSortableHeaderProps('leadId')}>
          Lead ID {getSortIcon('leadId')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('name')}>
          Name {getSortIcon('name')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('email')}>
          Email {getSortIcon('email')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('city')}>
          City {getSortIcon('city')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('existingPolicyHolder')}>
          Existing Policy Holder {getSortIcon('existingPolicyHolder')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('ltv')}>
          LTV {getSortIcon('ltv')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('leadScore')}>
          Lead Score {getSortIcon('leadScore')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('status')}>
          Status {getSortIcon('status')}
        </TableHead>
        <TableHead {...getSortableHeaderProps('lastActivity')}>
          Last Activity {getSortIcon('lastActivity')}
        </TableHead>
        <TableHead className="w-[7%]">
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <span>Tags</span>
          </div>
        </TableHead>
        <TableHead className="w-[5%]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
