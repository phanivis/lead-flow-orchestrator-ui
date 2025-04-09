
import React, { useState } from 'react';
import { Plus, X, Trash2, Save, Database } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadAttributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
];

// Custom attributes added by the user
const initialCustomAttributes = [
  { id: 'c1', name: 'Campaign Response', type: 'boolean', source: 'Custom' },
  { id: 'c2', name: 'Product Interest', type: 'text', source: 'Custom' },
];

export const LeadAttributeDialog = ({ open, onOpenChange }: LeadAttributeDialogProps) => {
  const [cdpAttributes, setCdpAttributes] = useState(initialCdpAttributes);
  const [customAttributes, setCustomAttributes] = useState(initialCustomAttributes);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    '1', '2', '3', '4', '5', '7', 'c1'
  ]);
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'text' });
  const [searchTerm, setSearchTerm] = useState('');

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

  const allAttributes = [...cdpAttributes, ...customAttributes];
  
  const filteredAttributes = allAttributes.filter(attr => 
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            CDP & Custom Attributes
          </DialogTitle>
          <DialogDescription>
            Select attributes to display or add custom attributes to your leads.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Add New Custom Attribute</h3>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Attribute name" 
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
              />
              <Select 
                value={newAttribute.type} 
                onValueChange={(value) => setNewAttribute({ ...newAttribute, type: value })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddNewAttribute} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Available Attributes</h3>
              <Input 
                placeholder="Search attributes..." 
                className="w-[200px] h-8 text-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto space-y-2">
              {filteredAttributes.map((attribute) => (
                <div 
                  key={attribute.id} 
                  className="flex justify-between items-center p-2 hover:bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedAttributes.includes(attribute.id)} 
                      onChange={() => handleSelectAttribute(attribute.id)}
                      className="rounded border-gray-300"
                    />
                    <span>{attribute.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {attribute.type}
                    </Badge>
                    <Badge 
                      variant={attribute.source === 'CDP' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {attribute.source}
                    </Badge>
                  </div>
                  {attribute.source === 'Custom' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => handleDeleteCustomAttribute(attribute.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}

              {filteredAttributes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No attributes found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
        
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
