
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckIcon, FilterX } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: Filters) => void;
}

export interface Filters {
  status: string[];
  city: string[];
  existingPolicyHolder: string;
}

export const FilterDialog = ({
  open,
  onOpenChange,
  onApplyFilters
}: FilterDialogProps) => {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [policyHolderFilter, setPolicyHolderFilter] = useState<string>('');

  const statusOptions = ['New', 'In Progress', 'Qualified', 'Hot Lead'];
  const cityOptions = ['New York', 'San Francisco', 'Chicago', 'Dallas', 'Miami', 'Boston'];
  
  const handleApplyFilters = () => {
    const filters = {
      status: statusFilter,
      city: cityFilter,
      existingPolicyHolder: policyHolderFilter
    };
    
    onApplyFilters(filters);
    onOpenChange(false);
    toast.success('Filters applied successfully');
  };

  const handleClearFilters = () => {
    setStatusFilter([]);
    setCityFilter([]);
    setPolicyHolderFilter('');
    onApplyFilters({ status: [], city: [], existingPolicyHolder: '' });
    toast.info('Filters cleared');
    onOpenChange(false);
  };

  const handleStatusChange = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const handleCityChange = (city: string) => {
    if (cityFilter.includes(city)) {
      setCityFilter(cityFilter.filter(c => c !== city));
    } else {
      setCityFilter([...cityFilter, city]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Leads</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Lead Status</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {statusOptions.map(status => (
                <Button
                  key={status}
                  type="button"
                  variant={statusFilter.includes(status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  className="flex items-center gap-1"
                >
                  {statusFilter.includes(status) && <CheckIcon size={14} />}
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {cityOptions.map(city => (
                <Button
                  key={city}
                  type="button"
                  variant={cityFilter.includes(city) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCityChange(city)}
                  className="flex items-center gap-1"
                >
                  {cityFilter.includes(city) && <CheckIcon size={14} />}
                  {city}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyHolder">Existing Policy Holder</Label>
            <Select value={policyHolderFilter} onValueChange={setPolicyHolderFilter}>
              <SelectTrigger id="policyHolder">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
          >
            <FilterX size={16} className="mr-2" />
            Clear Filters
          </Button>
          <Button type="button" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
