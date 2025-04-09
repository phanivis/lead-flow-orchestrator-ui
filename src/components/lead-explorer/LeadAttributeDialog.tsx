import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Save, Database, Calculator, Code } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { toast } from 'sonner';

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
  { id: '11', name: 'Date of Birth', type: 'date', source: 'CDP' },
  { id: '12', name: 'Current Date', type: 'date', source: 'CDP' },
];

// Custom attributes added by the user
const initialCustomAttributes = [
  { id: 'c1', name: 'Campaign Response', type: 'boolean', source: 'Custom' },
  { id: 'c2', name: 'Product Interest', type: 'text', source: 'Custom' },
];

// Operators grouped by type
const operatorsByType = {
  numerical: [
    { value: '+', label: 'Add (+)' },
    { value: '-', label: 'Subtract (-)' },
    { value: '*', label: 'Multiply (*)' },
    { value: '/', label: 'Divide (/)' },
  ],
  text: [
    { value: 'concat', label: 'Concatenate' },
  ],
  date: [
    { value: 'year_diff', label: 'Year Difference' },
  ]
};

export const LeadAttributeDialog = ({ open, onOpenChange }: LeadAttributeDialogProps) => {
  const [cdpAttributes, setCdpAttributes] = useState(initialCdpAttributes);
  const [customAttributes, setCustomAttributes] = useState(initialCustomAttributes);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    '1', '2', '3', '4', '5', '7', 'c1'
  ]);
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'text' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // New state for calculated attributes
  const [newCalculatedAttr, setNewCalculatedAttr] = useState({
    name: '',
    firstAttribute: '',
    operator: '+',
    secondAttribute: '',
    description: ''
  });

  // State for available operators based on selected attributes
  const [availableOperators, setAvailableOperators] = useState(operatorsByType.numerical);

  const allAttributes = [...cdpAttributes, ...customAttributes];

  // Function to get attribute type by ID
  const getAttributeTypeById = (attributeId: string) => {
    const attribute = allAttributes.find(attr => attr.id === attributeId);
    return attribute?.type || '';
  };

  // Update available operators when attributes are selected
  useEffect(() => {
    if (!newCalculatedAttr.firstAttribute) return;
    
    const firstAttrType = getAttributeTypeById(newCalculatedAttr.firstAttribute);
    
    if (firstAttrType === 'number') {
      setAvailableOperators(operatorsByType.numerical);
      if (!operatorsByType.numerical.some(op => op.value === newCalculatedAttr.operator)) {
        setNewCalculatedAttr(prev => ({ ...prev, operator: '+' }));
      }
    } else if (firstAttrType === 'text' || firstAttrType === 'email' || firstAttrType === 'phone') {
      setAvailableOperators(operatorsByType.text);
      if (newCalculatedAttr.operator !== 'concat') {
        setNewCalculatedAttr(prev => ({ ...prev, operator: 'concat' }));
      }
    } else if (firstAttrType === 'date') {
      setAvailableOperators(operatorsByType.date);
      if (newCalculatedAttr.operator !== 'year_diff') {
        setNewCalculatedAttr(prev => ({ ...prev, operator: 'year_diff' }));
      }
    } else {
      // Default to numerical operators
      setAvailableOperators(operatorsByType.numerical);
    }
  }, [newCalculatedAttr.firstAttribute]);

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

  const handleCreateCalculatedAttribute = () => {
    if (!newCalculatedAttr.name.trim() || !newCalculatedAttr.firstAttribute || !newCalculatedAttr.secondAttribute) {
      toast.error('Please fill all required fields for the calculated attribute');
      return;
    }

    // Find the attribute names based on their IDs
    const firstAttrName = [...cdpAttributes, ...customAttributes].find(
      attr => attr.id === newCalculatedAttr.firstAttribute
    )?.name || '';
    
    const secondAttrName = [...cdpAttributes, ...customAttributes].find(
      attr => attr.id === newCalculatedAttr.secondAttribute
    )?.name || '';

    // Generate expression based on the operator
    let expression = '';
    let resultType = 'text';
    
    if (newCalculatedAttr.operator === 'year_diff') {
      expression = `Year difference between ${firstAttrName} and ${secondAttrName}`;
      resultType = 'number';
    } else if (newCalculatedAttr.operator === 'concat') {
      expression = `${firstAttrName} + ${secondAttrName}`;
      resultType = 'text';
    } else {
      expression = `${firstAttrName} ${newCalculatedAttr.operator} ${secondAttrName}`;
      resultType = 'number';
    }

    // Create the new calculated attribute
    const newId = `c${customAttributes.length + 3}`;
    const calculatedAttr = {
      id: newId,
      name: newCalculatedAttr.name,
      type: resultType,
      source: 'Calculated',
      description: newCalculatedAttr.description || expression
    };

    setCustomAttributes([...customAttributes, calculatedAttr]);
    setSelectedAttributes([...selectedAttributes, newId]);
    
    // Reset the form
    setNewCalculatedAttr({
      name: '',
      firstAttribute: '',
      operator: '+',
      secondAttribute: '',
      description: ''
    });

    toast.success(`Calculated attribute "${newCalculatedAttr.name}" created successfully`);
  };

  const filteredAttributes = allAttributes.filter(attr => 
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="grid gap-4">
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
                          variant={attribute.source === 'CDP' ? 'secondary' : (
                            attribute.source === 'Calculated' ? 'default' : 'outline'
                          )}
                          className="text-xs"
                        >
                          {attribute.source}
                        </Badge>
                      </div>
                      {(attribute.source === 'Custom' || attribute.source === 'Calculated') && (
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
          </TabsContent>
          
          <TabsContent value="create" className="mt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Create Calculated Attribute
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create new attributes by combining or transforming existing CDP attributes
                </p>
              </div>
              
              <div className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Attribute Name</label>
                    <Input 
                      placeholder="e.g., Age" 
                      value={newCalculatedAttr.name}
                      onChange={(e) => setNewCalculatedAttr({ 
                        ...newCalculatedAttr, 
                        name: e.target.value 
                      })}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Input 
                      placeholder="What this attribute represents" 
                      value={newCalculatedAttr.description}
                      onChange={(e) => setNewCalculatedAttr({ 
                        ...newCalculatedAttr, 
                        description: e.target.value 
                      })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 items-end">
                  <div className="col-span-3">
                    <label className="text-sm font-medium">First Attribute</label>
                    <Select
                      value={newCalculatedAttr.firstAttribute}
                      onValueChange={(value) => setNewCalculatedAttr({
                        ...newCalculatedAttr,
                        firstAttribute: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {allAttributes.map((attr) => (
                          <SelectItem key={attr.id} value={attr.id}>
                            {attr.name} ({attr.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select
                      value={newCalculatedAttr.operator}
                      onValueChange={(value) => setNewCalculatedAttr({
                        ...newCalculatedAttr,
                        operator: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOperators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <label className="text-sm font-medium">Second Attribute</label>
                    <Select
                      value={newCalculatedAttr.secondAttribute}
                      onValueChange={(value) => setNewCalculatedAttr({
                        ...newCalculatedAttr,
                        secondAttribute: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {allAttributes.map((attr) => (
                          <SelectItem key={attr.id} value={attr.id}>
                            {attr.name} ({attr.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md mt-4">
                  <div className="flex items-start">
                    <Code className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Example Transformations:</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        <li>• Age = Current_date - Date of Birth (using Year Difference)</li>
                        <li>• Full Name = First Name + Last Name (using Concatenate)</li>
                        <li>• Average Order Value = Total Revenue / Order Count (using Divide)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCreateCalculatedAttribute}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Calculated Attribute
                </Button>
              </div>
            </div>
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
