
import React, { useState, useEffect } from 'react';
import { Plus, Calculator, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AttributeBuilderForm } from './AttributeBuilderForm';
import { SqlExpressionForm } from './SqlExpressionForm';

interface Attribute {
  id: string;
  name: string;
  type: string;
  source: string;
  description?: string;
}

interface CalculatedAttributeTabProps {
  allAttributes: Attribute[];
  onCreateCalculatedAttribute: (newAttribute: {
    id: string,
    name: string,
    type: string,
    source: string,
    description?: string
  }) => void;
  customAttributesLength: number;
}

export const CalculatedAttributeTab: React.FC<CalculatedAttributeTabProps> = ({
  allAttributes,
  onCreateCalculatedAttribute,
  customAttributesLength
}) => {
  const [editorMode, setEditorMode] = useState<"builder" | "sql">("builder");
  const [attributeName, setAttributeName] = useState('');
  const [description, setDescription] = useState('');
  const [resultType, setResultType] = useState('number');
  
  // State for the builder interface
  const [newCalculatedAttr, setNewCalculatedAttr] = useState({
    firstAttribute: '',
    operator: '+',
    secondAttribute: '',
  });

  // State for the SQL expression
  const [sqlExpression, setSqlExpression] = useState('');

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

  // State for available operators based on selected attributes
  const [availableOperators, setAvailableOperators] = useState(operatorsByType.numerical);

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
      setResultType('number');
    } else if (firstAttrType === 'text' || firstAttrType === 'email' || firstAttrType === 'phone') {
      setAvailableOperators(operatorsByType.text);
      if (newCalculatedAttr.operator !== 'concat') {
        setNewCalculatedAttr(prev => ({ ...prev, operator: 'concat' }));
      }
      setResultType('text');
    } else if (firstAttrType === 'date') {
      setAvailableOperators(operatorsByType.date);
      if (newCalculatedAttr.operator !== 'year_diff') {
        setNewCalculatedAttr(prev => ({ ...prev, operator: 'year_diff' }));
      }
      setResultType('number');
    } else {
      // Default to numerical operators
      setAvailableOperators(operatorsByType.numerical);
      setResultType('number');
    }
  }, [newCalculatedAttr.firstAttribute]);

  const handleCreateCalculatedAttribute = () => {
    if (!attributeName.trim()) {
      return;
    }

    let finalDescription = description;
    
    if (editorMode === "builder") {
      if (!newCalculatedAttr.firstAttribute || !newCalculatedAttr.secondAttribute) {
        return;
      }

      // Find the attribute names based on their IDs
      const firstAttrName = allAttributes.find(
        attr => attr.id === newCalculatedAttr.firstAttribute
      )?.name || '';
      
      const secondAttrName = allAttributes.find(
        attr => attr.id === newCalculatedAttr.secondAttribute
      )?.name || '';

      // Generate expression based on the operator
      let expression = '';
      
      if (newCalculatedAttr.operator === 'year_diff') {
        expression = `Year difference between ${firstAttrName} and ${secondAttrName}`;
      } else if (newCalculatedAttr.operator === 'concat') {
        expression = `${firstAttrName} + ${secondAttrName}`;
      } else {
        expression = `${firstAttrName} ${newCalculatedAttr.operator} ${secondAttrName}`;
      }

      // Use description or fallback to expression
      finalDescription = description || expression;
    } else {
      // For SQL mode, use the SQL expression if no description is provided
      finalDescription = description || sqlExpression;
    }

    // Create the new calculated attribute
    const newId = `c${customAttributesLength + 3}`;
    const calculatedAttr = {
      id: newId,
      name: attributeName,
      type: resultType,
      source: 'Calculated',
      description: finalDescription
    };

    onCreateCalculatedAttribute(calculatedAttr);
    
    // Reset form
    setAttributeName('');
    setDescription('');
    setSqlExpression('');
    setNewCalculatedAttr({
      firstAttribute: '',
      operator: '+',
      secondAttribute: '',
    });
  };

  return (
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
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
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
            newCalculatedAttr={newCalculatedAttr}
            setNewCalculatedAttr={setNewCalculatedAttr}
            availableOperators={availableOperators}
          />
        ) : (
          <SqlExpressionForm
            sqlExpression={sqlExpression}
            setSqlExpression={setSqlExpression}
            setResultType={setResultType}
            resultType={resultType}
          />
        )}
        
        <Button 
          onClick={handleCreateCalculatedAttribute}
          className="w-full"
          disabled={!attributeName.trim() || (editorMode === "builder" ? 
            (!newCalculatedAttr.firstAttribute || !newCalculatedAttr.secondAttribute) : 
            !sqlExpression.trim())}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Calculated Attribute
        </Button>
      </div>
    </div>
  );
};
