
import React from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface RuleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: {
      active: boolean;
      paused: boolean;
    };
    updatedBy: string;
    tags: string[];
  };
  onApplyFilters: (filters: any) => void;
}

export const RuleFilterDialog = ({ 
  open, 
  onOpenChange,
  filters,
  onApplyFilters
}: RuleFilterDialogProps) => {
  const [localFilters, setLocalFilters] = React.useState(filters);
  const [tagInput, setTagInput] = React.useState('');

  const handleStatusChange = (key: 'active' | 'paused', checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [key]: checked
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !localFilters.tags.includes(tagInput.trim())) {
      setLocalFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setLocalFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({
      status: { active: false, paused: false },
      updatedBy: '',
      tags: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Qualification Rules</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={localFilters.status.active}
                  onCheckedChange={(checked) => handleStatusChange('active', checked as boolean)}
                />
                <Label htmlFor="active" className="cursor-pointer">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="paused" 
                  checked={localFilters.status.paused}
                  onCheckedChange={(checked) => handleStatusChange('paused', checked as boolean)}
                />
                <Label htmlFor="paused" className="cursor-pointer">Paused</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="updatedBy">Updated By</Label>
            <Input 
              id="updatedBy" 
              placeholder="Email address" 
              value={localFilters.updatedBy}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, updatedBy: e.target.value }))}
            />
          </div>

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
            {localFilters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.tags.map(tag => (
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
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" type="button" onClick={handleReset}>
            Reset Filters
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
