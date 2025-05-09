
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
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
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
  businessUnit: string[];
  leadScoreRange: [number, number];
  tags: string[];
  source: string[];
  updateDateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const FilterDialog = ({
  open,
  onOpenChange,
  onApplyFilters
}: FilterDialogProps) => {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [policyHolderFilter, setPolicyHolderFilter] = useState<string>('');
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string[]>([]);
  const [leadScoreRange, setLeadScoreRange] = useState<[number, number]>([0, 100]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const statusOptions = ['New', 'In Progress', 'Qualified', 'Hot Lead', 'Cold Lead', 'Converted', 'Lost'];
  const cityOptions = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];
  const businessUnitOptions = ['Auto Insurance', 'Health Insurance', 'Life Insurance', 'Home Insurance', 'Travel Insurance'];
  const sourceOptions = ['Website', 'Mobile App', 'Call Center', 'Partner Referral', 'Social Media', 'Email Campaign'];
  
  const handleApplyFilters = () => {
    const filters = {
      status: statusFilter,
      city: cityFilter,
      existingPolicyHolder: policyHolderFilter,
      businessUnit: businessUnitFilter,
      leadScoreRange: leadScoreRange,
      tags: tagFilter,
      source: sourceFilter,
      updateDateRange: dateRange
    };
    
    onApplyFilters(filters);
    onOpenChange(false);
    toast.success('Filters applied successfully');
  };

  const handleClearFilters = () => {
    setStatusFilter([]);
    setCityFilter([]);
    setPolicyHolderFilter('');
    setBusinessUnitFilter([]);
    setLeadScoreRange([0, 100]);
    setTagFilter([]);
    setTagInput('');
    setSourceFilter([]);
    setDateRange({ from: undefined, to: undefined });
    
    onApplyFilters({
      status: [],
      city: [],
      existingPolicyHolder: '',
      businessUnit: [],
      leadScoreRange: [0, 100],
      tags: [],
      source: [],
      updateDateRange: { from: undefined, to: undefined }
    });
    
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

  const handleBusinessUnitChange = (bu: string) => {
    if (businessUnitFilter.includes(bu)) {
      setBusinessUnitFilter(businessUnitFilter.filter(b => b !== bu));
    } else {
      setBusinessUnitFilter([...businessUnitFilter, bu]);
    }
  };

  const handleSourceChange = (source: string) => {
    if (sourceFilter.includes(source)) {
      setSourceFilter(sourceFilter.filter(s => s !== source));
    } else {
      setSourceFilter([...sourceFilter, source]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tagFilter.includes(tagInput.trim())) {
      setTagFilter(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTagFilter(prev => prev.filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Leads</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Status Filter */}
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

          {/* Business Unit Filter */}
          <div className="space-y-2">
            <Label htmlFor="businessUnit">Business Unit / Product</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {businessUnitOptions.map(bu => (
                <Button
                  key={bu}
                  type="button"
                  variant={businessUnitFilter.includes(bu) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBusinessUnitChange(bu)}
                  className="flex items-center gap-1"
                >
                  {businessUnitFilter.includes(bu) && <CheckIcon size={14} />}
                  {bu}
                </Button>
              ))}
            </div>
          </div>

          {/* Lead Score Range */}
          <div className="space-y-2">
            <Label htmlFor="leadScore">Lead Score Range: {leadScoreRange[0]} - {leadScoreRange[1]}</Label>
            <Slider
              id="leadScore"
              defaultValue={[0, 100]}
              min={0}
              max={100}
              step={1}
              value={leadScoreRange}
              onValueChange={(values) => setLeadScoreRange(values as [number, number])}
              className="mt-2"
            />
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input 
                id="tags" 
                placeholder="Add tag" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>
            {tagFilter.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tagFilter.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Lead Source Filter */}
          <div className="space-y-2">
            <Label htmlFor="source">Lead Source</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sourceOptions.map(source => (
                <Button
                  key={source}
                  type="button"
                  variant={sourceFilter.includes(source) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSourceChange(source)}
                  className="flex items-center gap-1"
                >
                  {sourceFilter.includes(source) && <CheckIcon size={14} />}
                  {source}
                </Button>
              ))}
            </div>
          </div>

          {/* Update Date Range Filter */}
          <div className="space-y-2">
            <Label htmlFor="dateRange">Update Date Range</Label>
            <div className="flex gap-4 items-center">
              <div className="grid gap-2">
                <Label htmlFor="from" className="text-xs">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from"
                      variant={"outline"}
                      className="w-[150px] justify-start text-left text-sm font-normal"
                    >
                      {dateRange.from ? format(dateRange.from, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="to" className="text-xs">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to"
                      variant={"outline"}
                      className="w-[150px] justify-start text-left text-sm font-normal"
                    >
                      {dateRange.to ? format(dateRange.to, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* City Filter */}
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

          {/* Policy Holder Filter */}
          <div className="space-y-2">
            <Label htmlFor="policyHolder">Existing Policy Holder</Label>
            <Select value={policyHolderFilter} onValueChange={setPolicyHolderFilter}>
              <SelectTrigger id="policyHolder">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
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

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
