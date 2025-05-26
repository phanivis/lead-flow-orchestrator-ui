
import React, { useState } from 'react';
import { Plus, Database, X, Save, Code, Calculator } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
  const [creationType, setCreationType] = useState<'source' | 'sql'>('source');
  
  // Source mapping fields
  const [selectedSourceAttribute, setSelectedSourceAttribute] = useState('');
  const [customMapping, setCustomMapping] = useState('');
  
  // SQL expression fields
  const [sqlExpression, setSqlExpression] = useState('');
  const [resultType, setResultType] = useState('text');

  const resetForm = () => {
    setAttributeName('');
    setDescription('');
    setCreationType('source');
    setSelectedSourceAttribute('');
    setCustomMapping('');
    setSqlExpression('');
    setResultType('text');
  };

  const handleCreateAttribute = () => {
    if (!attributeName.trim()) {
      toast.error('Please enter an attribute name');
      return;
    }

    let newAttribute;

    if (creationType === 'source') {
      if (!selectedSourceAttribute) {
        toast.error('Please select a source attribute');
        return;
      }

      const sourceAttr = availableAttributes.find(attr => attr.id === selectedSourceAttribute);
      
      newAttribute = {
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
    } else {
      if (!sqlExpression.trim()) {
        toast.error('Please enter a SQL expression');
        return;
      }

      newAttribute = {
        id: Date.now(),
        name: attributeName,
        type: resultType.charAt(0).toUpperCase() + resultType.slice(1),
        source: 'LMS',
        visible: true,
        editable: true,
        description: description || sqlExpression,
        sqlExpression: sqlExpression
      };
    }

    onCreateAttribute(newAttribute);
    toast.success(`Attribute "${attributeName}" created successfully`);
    resetForm();
    onOpenChange(false);
  };

  const selectedAttr = availableAttributes.find(attr => attr.id === selectedSourceAttribute);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Create New Attribute
          </DialogTitle>
          <DialogDescription>
            Create a new attribute by mapping to existing data sources or using SQL expressions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="attributeName">Attribute Name</Label>
            <Input
              id="attributeName"
              placeholder="e.g., Customer Email or Revenue per Employee"
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
            <Label>Creation Type</Label>
            <ToggleGroup 
              type="single" 
              value={creationType}
              onValueChange={(value) => value && setCreationType(value as 'source' | 'sql')}
              className="justify-start"
            >
              <ToggleGroupItem value="source">
                <Database className="h-4 w-4 mr-1" />
                Source Mapping
              </ToggleGroupItem>
              <ToggleGroupItem value="sql">
                <Code className="h-4 w-4 mr-1" />
                SQL Expression
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {creationType === 'source' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="sqlExpression">SQL Expression</Label>
                <Textarea
                  id="sqlExpression"
                  placeholder="e.g., [Annual Revenue] / [Employee Count] or CONCAT([First Name], ' ', [Last Name])"
                  value={sqlExpression}
                  onChange={(e) => setSqlExpression(e.target.value)}
                  className="font-mono text-sm h-24"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="resultType">Result Type</Label>
                <Select value={resultType} onValueChange={setResultType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-start">
                  <Code className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">SQL Expression Examples:</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">[Annual Revenue] / [Employee Count]</code> - Revenue per employee</li>
                      <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">CONCAT([First Name], ' ', [Last Name])</code> - Full name</li>
                      <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">DATEDIFF(year, [Date of Birth], GETDATE())</code> - Age calculation</li>
                      <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">CASE WHEN [Lead Source] = 'Website' THEN 1 ELSE 0 END</code> - Boolean condition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
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
