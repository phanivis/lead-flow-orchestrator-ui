
import React, { useState } from 'react';
import { Plus, Database, X, Save } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Available CDP and data source attributes
const availableAttributes = [
  { id: 'cdp_first_name', name: 'First Name', source: 'CDP', type: 'text' },
  { id: 'cdp_last_name', name: 'Last Name', source: 'CDP', type: 'text' },
  { id: 'cdp_email', name: 'Email', source: 'CDP', type: 'email' },
  { id: 'cdp_phone', name: 'Phone', source: 'CDP', type: 'phone' },
  { id: 'cdp_company', name: 'Company', source: 'CDP', type: 'text' },
  { id: 'cdp_industry', name: 'Industry', source: 'CDP', type: 'text' },
  { id: 'cdp_annual_revenue', name: 'Annual Revenue', source: 'CDP', type: 'number' },
  { id: 'cdp_employee_count', name: 'Employee Count', source: 'CDP', type: 'number' },
  { id: 'cdp_lead_source', name: 'Lead Source', source: 'CDP', type: 'text' },
  { id: 'cdp_last_visit', name: 'Last Website Visit', source: 'CDP', type: 'date' },
  { id: 'marketing_campaign', name: 'Campaign Name', source: 'Marketing', type: 'text' },
  { id: 'marketing_channel', name: 'Marketing Channel', source: 'Marketing', type: 'text' },
  { id: 'analytics_page_views', name: 'Page Views', source: 'Analytics', type: 'number' },
  { id: 'analytics_session_duration', name: 'Session Duration', source: 'Analytics', type: 'number' },
  { id: 'social_mentions', name: 'Social Media Mentions', source: 'Social', type: 'number' },
  { id: 'support_tickets', name: 'Support Tickets Count', source: 'Support', type: 'number' },
];

interface CreateAttributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAttribute: (attribute: any) => void;
}

export const CreateAttributeDialog = ({ 
  open, 
  onOpenChange, 
  onCreateAttribute 
}: CreateAttributeDialogProps) => {
  const [attributeName, setAttributeName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSourceAttribute, setSelectedSourceAttribute] = useState('');
  const [customMapping, setCustomMapping] = useState('');

  const resetForm = () => {
    setAttributeName('');
    setDescription('');
    setSelectedSourceAttribute('');
    setCustomMapping('');
  };

  const handleCreateAttribute = () => {
    if (!attributeName.trim()) {
      toast.error('Please enter an attribute name');
      return;
    }

    if (!selectedSourceAttribute) {
      toast.error('Please select a source attribute');
      return;
    }

    const sourceAttr = availableAttributes.find(attr => attr.id === selectedSourceAttribute);
    
    const newAttribute = {
      id: Date.now(),
      name: attributeName,
      type: sourceAttr?.type.charAt(0).toUpperCase() + sourceAttr?.type.slice(1) || 'Text',
      source: 'LMS',
      visible: true,
      editable: true,
      description: description || `Maps to ${sourceAttr?.name} from ${sourceAttr?.source}`,
      sourceMapping: {
        sourceAttributeId: selectedSourceAttribute,
        sourceAttributeName: sourceAttr?.name,
        sourceSystem: sourceAttr?.source,
        customMapping: customMapping || null
      }
    };

    onCreateAttribute(newAttribute);
    toast.success(`Attribute "${attributeName}" created successfully`);
    resetForm();
    onOpenChange(false);
  };

  const selectedAttr = availableAttributes.find(attr => attr.id === selectedSourceAttribute);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Create New Attribute
          </DialogTitle>
          <DialogDescription>
            Create a new attribute that maps to an existing attribute from CDP or other data sources.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="attributeName">Attribute Name</Label>
            <Input
              id="attributeName"
              placeholder="e.g., Customer Email"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What this attribute represents"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sourceAttribute">Source Attribute</Label>
            <Select value={selectedSourceAttribute} onValueChange={setSelectedSourceAttribute}>
              <SelectTrigger>
                <SelectValue placeholder="Select an attribute from data source" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(
                  availableAttributes.reduce((acc, attr) => {
                    if (!acc[attr.source]) acc[attr.source] = [];
                    acc[attr.source].push(attr);
                    return acc;
                  }, {} as Record<string, typeof availableAttributes>)
                ).map(([source, attrs]) => (
                  <div key={source}>
                    <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                      {source}
                    </div>
                    {attrs.map((attr) => (
                      <SelectItem key={attr.id} value={attr.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{attr.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {attr.type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAttr && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Selected Source:</div>
              <div className="text-sm text-muted-foreground">
                {selectedAttr.name} from {selectedAttr.source} ({selectedAttr.type})
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="customMapping">Custom Mapping (Optional)</Label>
            <Input
              id="customMapping"
              placeholder="e.g., UPPER([Email]) or custom transformation"
              value={customMapping}
              onChange={(e) => setCustomMapping(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Leave blank for direct mapping, or specify a transformation expression
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCreateAttribute}>
            <Save className="h-4 w-4 mr-2" />
            Create Attribute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
