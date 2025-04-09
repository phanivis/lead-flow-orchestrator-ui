
import React, { useState } from 'react';
import { X, Save, Database } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ExistingAttributesTab } from './attribute-dialog/ExistingAttributesTab';
import { CalculatedAttributeTab } from './attribute-dialog/CalculatedAttributeTab';

// Dummy CDP attributes
const initialCdpAttributes = [
  { id: '1', name: 'First Name', type: 'text', source: 'CDP' },
  { id: '2', name: 'Last Name', type: 'text', source: 'CDP' },
  { id: '3', name: 'Email', type: 'email', source: 'CDP' },
  { id: '4', name: 'Phone', type: 'phone', source: 'CDP' },
  { id: '5', name: 'Company', type: 'text', source: 'CDP' },
  { id: '6', name: 'Industry', type: 'text', source: 'CDP' },
  { id: '7', name: 'Annual Revenue', type: 'number', source: 'CDP' },
  { id: '8', name: 'Employee Count', type: 'number', source: 'CDP' },
  { id: '9', name: 'Lead Source', type: 'text', source: 'CDP' },
  { id: '10', name: 'Last Website Visit', type: 'date', source: 'CDP' },
  { id: '11', name: 'Date of Birth', type: 'date', source: 'CDP' },
  { id: '12', name: 'Current Date', type: 'date', source: 'CDP' },
];

// Custom attributes added by the user
const initialCustomAttributes = [
  { id: 'c1', name: 'Campaign Response', type: 'boolean', source: 'Custom' },
  { id: 'c2', name: 'Product Interest', type: 'text', source: 'Custom' },
];

interface LeadAttributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeadAttributeDialog = ({ open, onOpenChange }: LeadAttributeDialogProps) => {
  const [cdpAttributes, setCdpAttributes] = useState(initialCdpAttributes);
  const [customAttributes, setCustomAttributes] = useState(initialCustomAttributes);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    '1', '2', '3', '4', '5', '7', 'c1'
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'text' });

  const allAttributes = [...cdpAttributes, ...customAttributes];

  const handleSelectAttribute = (attributeId: string) => {
    if (selectedAttributes.includes(attributeId)) {
      setSelectedAttributes(selectedAttributes.filter(id => id !== attributeId));
    } else {
      setSelectedAttributes([...selectedAttributes, attributeId]);
    }
  };

  const handleAddNewAttribute = () => {
    if (newAttribute.name.trim()) {
      const newId = `c${customAttributes.length + 3}`;
      setCustomAttributes([
        ...customAttributes,
        { 
          id: newId, 
          name: newAttribute.name, 
          type: newAttribute.type, 
          source: 'Custom' 
        }
      ]);
      setSelectedAttributes([...selectedAttributes, newId]);
      setNewAttribute({ name: '', type: 'text' });
    }
  };

  const handleDeleteCustomAttribute = (attributeId: string) => {
    setCustomAttributes(customAttributes.filter(attr => attr.id !== attributeId));
    setSelectedAttributes(selectedAttributes.filter(id => id !== attributeId));
  };

  const handleCreateCalculatedAttribute = (calculatedAttr: {
    id: string,
    name: string,
    type: string,
    source: string,
    description?: string
  }) => {
    setCustomAttributes([...customAttributes, calculatedAttr]);
    setSelectedAttributes([...selectedAttributes, calculatedAttr.id]);
    toast.success(`Calculated attribute "${calculatedAttr.name}" created successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            CDP & Custom Attributes
          </DialogTitle>
          <DialogDescription>
            Select attributes to display or create custom attributes for your leads.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="existing">
          <TabsList className="w-full">
            <TabsTrigger value="existing" className="flex-1">Existing Attributes</TabsTrigger>
            <TabsTrigger value="create" className="flex-1">Create Calculated Attribute</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="mt-4">
            <ExistingAttributesTab
              allAttributes={allAttributes}
              selectedAttributes={selectedAttributes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSelectAttribute={handleSelectAttribute}
              handleDeleteCustomAttribute={handleDeleteCustomAttribute}
            />
          </TabsContent>
          
          <TabsContent value="create" className="mt-4">
            <CalculatedAttributeTab 
              allAttributes={allAttributes}
              onCreateCalculatedAttribute={handleCreateCalculatedAttribute}
              customAttributesLength={customAttributes.length}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
