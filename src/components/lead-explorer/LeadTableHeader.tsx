
import React from 'react';
import { Car, Bike, Heart, Ambulance, Briefcase } from 'lucide-react';
import { 
  TableHead,
  TableRow,
  TableHeader
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface LeadTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allLeadsSelected: boolean;
  hasLeads: boolean;
}

export const LeadTableHeader = ({ 
  onSelectAll, 
  allLeadsSelected,
  hasLeads
}: LeadTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox 
            checked={allLeadsSelected && hasLeads}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>City</TableHead>
        <TableHead>Existing Policy Holder</TableHead>
        <TableHead>LTV</TableHead>
        <TableHead colSpan={5} className="text-center">Lead Scores by Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Last Activity</TableHead>
        <TableHead className="w-16">Actions</TableHead>
      </TableRow>
      <TableRow>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead className="p-2 text-center">
          <div className="flex flex-col items-center">
            <Car className="h-4 w-4 mb-1" />
            <span className="text-xs">Car</span>
          </div>
        </TableHead>
        <TableHead className="p-2 text-center">
          <div className="flex flex-col items-center">
            <Bike className="h-4 w-4 mb-1" />
            <span className="text-xs">Bike</span>
          </div>
        </TableHead>
        <TableHead className="p-2 text-center">
          <div className="flex flex-col items-center">
            <Heart className="h-4 w-4 mb-1" />
            <span className="text-xs">Life</span>
          </div>
        </TableHead>
        <TableHead className="p-2 text-center">
          <div className="flex flex-col items-center">
            <Ambulance className="h-4 w-4 mb-1" />
            <span className="text-xs">Health</span>
          </div>
        </TableHead>
        <TableHead className="p-2 text-center">
          <div className="flex flex-col items-center">
            <Briefcase className="h-4 w-4 mb-1" />
            <span className="text-xs">Travel</span>
          </div>
        </TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
};
