
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface FieldMappingHeaderProps {
  onPreview: () => void;
}

const FieldMappingHeader = ({ onPreview }: FieldMappingHeaderProps) => {
  const handleSaveTemplate = () => {
    toast.success('Mapping template saved');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium">Field Mapping</h3>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPreview}
        >
          Preview Mapping
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              <span>Save Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Mapping Template</DialogTitle>
              <DialogDescription>
                Save this mapping for reuse with similar data sources.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium">Template Name</label>
              <Input placeholder="e.g., Marketing Leads Template" className="mt-1" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>Cancel</Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FieldMappingHeader;
