
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
import { toast } from 'sonner';
import { CalculatedAttributeTab } from './attribute-dialog/CalculatedAttributeTab';
import { EditAttributeForm } from './attribute-dialog/EditAttributeForm';
import { useAttributeDialogState } from './attribute-dialog/useAttributeDialogState';

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
  
  const {
    isEditMode,
    editorMode,
    setEditorMode,
    attributeName,
    setAttributeName,
    description,
    setDescription,
    resultType,
    setResultType,
    calculatedAttr,
    setCalculatedAttr,
    sqlExpression,
    setSqlExpression,
    resetForm
  } = useAttributeDialogState(attributeToEdit);

  const allAttributes = [...cdpAttributes, ...customAttributes];

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
          <EditAttributeForm
            attributeName={attributeName}
            setAttributeName={setAttributeName}
            description={description}
            setDescription={setDescription}
            editorMode={editorMode}
            setEditorMode={setEditorMode}
            calculatedAttr={calculatedAttr}
            setCalculatedAttr={setCalculatedAttr}
            sqlExpression={sqlExpression}
            setSqlExpression={setSqlExpression}
            resultType={resultType}
            setResultType={setResultType}
            allAttributes={allAttributes}
          />
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
