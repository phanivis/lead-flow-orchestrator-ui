
import React from 'react';
import { Car, Bike, Heart, Ambulance, Briefcase, Tag, Megaphone } from 'lucide-react';
import { 
  TableHead,
  TableRow,
  TableHeader
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ResizableHandle } from '@/components/ui/resizable';

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
        <TableHead className="w-[3%] relative">
          <Checkbox 
            checked={allLeadsSelected && hasLeads}
            onCheckedChange={onSelectAll}
          />
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[10%] relative">
          Lead ID
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[12%] relative">
          Name
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[15%] relative">
          Email
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[8%] relative">
          City
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[8%] relative">
          Existing Policy Holder
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[9%] relative">
          LTV
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[10%] relative">
          Lead Score
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[8%] relative">
          Status
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[8%] relative">
          Last Activity
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[7%] relative">
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <span>Tags</span>
          </div>
          <div className="absolute right-0 top-0 h-full cursor-col-resize w-1">
            <ResizableHandle withHandle />
          </div>
        </TableHead>
        <TableHead className="w-[5%]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

