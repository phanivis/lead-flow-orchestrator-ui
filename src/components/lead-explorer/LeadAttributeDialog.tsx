import React, { useState, useEffect } from 'react';
import { X, Save, Database, Calculator, Code } from 'lucide-react';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import { CalculatedAttributeTab } from './attribute-dialog/CalculatedAttributeTab';
import { AttributeBuilderForm } from './attribute-dialog/AttributeBuilderForm';
import { SqlExpressionForm } from './attribute-dialog/SqlExpressionForm';

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
  attributeToEdit?: any;
  onUpdateAttribute?: (updatedAttribute: any) => void;
}

export const LeadAttributeDialog = ({ 
  open, 
  onOpenChange, 
  attributeToEdit, 
  onUpdateAttribute 
}: LeadAttributeDialogProps) => {
  const [cdpAttributes] = useState(initialCdpAttributes);
  const [customAttributes, setCustomAttributes] = useState(initialCustomAttributes);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    '1', '2', '3', '4', '5', '7', 'c1'
  ]);
  
  // State for editing
  const [isEditMode, setIsEditMode] = useState(false);
  const [editorMode, setEditorMode] = useState<"builder" | "sql">("builder");
  const [attributeName, setAttributeName] = useState('');
  const [description, setDescription] = useState('');
  const [resultType, setResultType] = useState('number');
  const [calculatedAttr, setCalculatedAttr] = useState({
    firstAttribute: '',
    operator: '+',
    secondAttribute: '',
  });
  const [sqlExpression, setSqlExpression] = useState('');

  const allAttributes = [...cdpAttributes, ...customAttributes];

  // Set up form for editing if attributeToEdit is provided
  useEffect(() => {
    if (attributeToEdit) {
      setIsEditMode(true);
      setAttributeName(attributeToEdit.name);
      setResultType(attributeToEdit.type.toLowerCase());
      setDescription(attributeToEdit.description || '');
      
      // Determine which editor mode to use based on attribute data
      if (attributeToEdit.formula) {
        setEditorMode('builder');
        setCalculatedAttr({
          firstAttribute: String(attributeToEdit.formula.firstAttribute),
          operator: attributeToEdit.formula.operator,
          secondAttribute: String(attributeToEdit.formula.secondAttribute)
        });
      } else if (attributeToEdit.sqlExpression) {
        setEditorMode('sql');
        setSqlExpression(attributeToEdit.sqlExpression);
      } else {
        // Default to builder mode if no formula info
        setEditorMode('builder');
      }
    } else {
      // Reset form when opening for new attribute
      resetForm();
    }
  }, [attributeToEdit, open]);

  const resetForm = () => {
    setIsEditMode(false);
    setAttributeName('');
    setDescription('');
    setResultType('number');
    setCalculatedAttr({
      firstAttribute: '',
      operator: '+',
      secondAttribute: '',
    });
    setSqlExpression('');
    setEditorMode('builder');
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
    onOpenChange(false);
  };

  const handleSaveChanges = () => {
    if (isEditMode && attributeToEdit && onUpdateAttribute) {
      // Create updated attribute object
      const updatedAttribute = {
        ...attributeToEdit,
        name: attributeName,
        type: resultType.charAt(0).toUpperCase() + resultType.slice(1),
        description: description,
      };

      // Add formula or sqlExpression based on the editor mode
      if (editorMode === 'builder') {
        updatedAttribute.formula = {
          firstAttribute: calculatedAttr.firstAttribute,
          operator: calculatedAttr.operator,
          secondAttribute: calculatedAttr.secondAttribute
        };
        delete updatedAttribute.sqlExpression;
      } else {
        updatedAttribute.sqlExpression = sqlExpression;
        delete updatedAttribute.formula;
      }

      onUpdateAttribute(updatedAttribute);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {isEditMode ? 'Edit Attribute' : 'Create Calculated Attribute'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Edit the selected attribute properties and formula.'
              : 'Create new attributes by combining or transforming existing CDP attributes.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {isEditMode ? (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Attribute Name</label>
                <Input 
                  placeholder="e.g., Age" 
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input 
                  placeholder="What this attribute represents" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Editor Mode</label>
              <ToggleGroup 
                type="single" 
                value={editorMode}
                onValueChange={(value) => value && setEditorMode(value as "builder" | "sql")}
                className="justify-start mt-1"
              >
                <ToggleGroupItem value="builder">
                  <Calculator className="h-4 w-4 mr-1" />
                  Builder
                </ToggleGroupItem>
                <ToggleGroupItem value="sql">
                  <Code className="h-4 w-4 mr-1" />
                  SQL Expression
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {editorMode === "builder" ? (
              <AttributeBuilderForm
                allAttributes={allAttributes}
                newCalculatedAttr={calculatedAttr}
                setNewCalculatedAttr={setCalculatedAttr}
                availableOperators={[
                  { value: '+', label: 'Add (+)' },
                  { value: '-', label: 'Subtract (-)' },
                  { value: '*', label: 'Multiply (*)' },
                  { value: '/', label: 'Divide (/)' },
                  { value: 'concat', label: 'Concatenate' },
                  { value: 'year_diff', label: 'Year Difference' },
                ]}
              />
            ) : (
              <SqlExpressionForm
                sqlExpression={sqlExpression}
                setSqlExpression={setSqlExpression}
                setResultType={setResultType}
                resultType={resultType}
              />
            )}
          </div>
        ) : (
          <CalculatedAttributeTab 
            allAttributes={allAttributes}
            onCreateCalculatedAttribute={handleCreateCalculatedAttribute}
            customAttributesLength={customAttributes.length}
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={isEditMode ? handleSaveChanges : () => onOpenChange(false)}>
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? 'Save Changes' : 'Done'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
