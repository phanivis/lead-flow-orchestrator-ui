
import React from 'react';
import { 
  TableHead,
  TableRow,
  TableHeader
} from '@/components/ui/table';
import { Tag } from 'lucide-react';

interface LeadTableHeaderProps {
  hasLeads: boolean;
}

export const LeadTableHeader = ({ 
  hasLeads
}: LeadTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[10%]">Lead ID</TableHead>
        <TableHead className="w-[12%]">Name</TableHead>
        <TableHead className="w-[15%]">Email</TableHead>
        <TableHead className="w-[8%]">City</TableHead>
        <TableHead className="w-[8%]">Existing Policy Holder</TableHead>
        <TableHead className="w-[9%]">LTV</TableHead>
        <TableHead className="w-[10%]">Lead Score</TableHead>
        <TableHead className="w-[8%]">Status</TableHead>
        <TableHead className="w-[8%]">Last Activity</TableHead>
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
