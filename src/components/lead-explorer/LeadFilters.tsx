
import React from 'react';
import { Search, RefreshCcw, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface LeadFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefreshData: () => void;
  onOpenAttributeDialog: () => void;
  onOpenFilterDialog: () => void;
}

export const LeadFilters = ({
  searchTerm,
  setSearchTerm,
  onRefreshData,
  onOpenAttributeDialog,
  onOpenFilterDialog
}: LeadFiltersProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search leads..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/attribute-visibility')}
        >
          <EyeOff size={16} className="mr-2" />
          View/Hide Attributes
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefreshData}
        >
          <RefreshCcw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
