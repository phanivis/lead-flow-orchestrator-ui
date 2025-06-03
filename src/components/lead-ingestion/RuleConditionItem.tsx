
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { RuleCondition, AttributeDefinition, ConditionOperator } from '@/types/leadIngestionTypes';
import { getOperatorOptions, getOperatorLabel } from './utils/ruleOperators';

interface RuleConditionItemProps {
  condition: RuleCondition;
  index: number;
  attributes: AttributeDefinition[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<RuleCondition>) => void;
}

export const RuleConditionItem = ({
  condition,
  index,
  attributes,
  onRemove,
  onUpdate,
}: RuleConditionItemProps) => {
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeDefinition | undefined>(
    attributes.find(a => a.name === condition.attributeName)
  );
  
  useEffect(() => {
    const attr = attributes.find(a => a.name === condition.attributeName);
    setSelectedAttribute(attr);
  }, [condition.attributeName, attributes]);
  
  const handleAttributeChange = (attributeName: string) => {
    const attribute = attributes.find(a => a.name === attributeName);
    setSelectedAttribute(attribute);
    
    onUpdate(condition.id, { 
      attributeName,
      operator: 'exists',
      value: undefined
    });
  };
  
  const handleOperatorChange = (operator: string) => {
    onUpdate(condition.id, { 
      operator: operator as ConditionOperator,
      value: operator === 'exists' || operator === 'not_exists' ? undefined : condition.value
    });
  };
  
  const handleValueChange = (value: string) => {
    let parsedValue: string | number | boolean = value;
    
    if (selectedAttribute?.type === 'number' && !isNaN(Number(value))) {
      parsedValue = Number(value);
    } else if (selectedAttribute?.type === 'boolean') {
      if (value.toLowerCase() === 'true') parsedValue = true;
      else if (value.toLowerCase() === 'false') parsedValue = false;
    }
    
    onUpdate(condition.id, { value: parsedValue });
  };
  
  const operatorOptions = getOperatorOptions(selectedAttribute?.type);
  
  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium">Condition {index + 1}</div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(condition.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`attribute-${condition.id}`}>Attribute</Label>
          <Select
            value={condition.attributeName}
            onValueChange={handleAttributeChange}
          >
            <SelectTrigger id={`attribute-${condition.id}`}>
              <SelectValue placeholder="Select attribute" />
            </SelectTrigger>
            <SelectContent>
              {attributes.map(attr => (
                <SelectItem key={attr.id} value={attr.name}>
                  {attr.displayName} ({attr.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor={`operator-${condition.id}`}>Operator</Label>
          <Select
            value={condition.operator}
            onValueChange={handleOperatorChange}
          >
            <SelectTrigger id={`operator-${condition.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map(op => (
                <SelectItem key={op} value={op}>
                  {getOperatorLabel(op)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {condition.operator !== 'exists' && condition.operator !== 'not_exists' && (
          <div>
            <Label htmlFor={`value-${condition.id}`}>Value</Label>
            {selectedAttribute?.type === 'boolean' ? (
              <Select
                value={condition.value !== undefined ? String(condition.value) : ''}
                onValueChange={handleValueChange}
              >
                <SelectTrigger id={`value-${condition.id}`}>
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            ) : selectedAttribute?.type === 'date' ? (
              <Input
                id={`value-${condition.id}`}
                type="date"
                value={condition.value !== undefined ? String(condition.value) : ''}
                onChange={(e) => handleValueChange(e.target.value)}
              />
            ) : (
              <Input
                id={`value-${condition.id}`}
                type={selectedAttribute?.type === 'number' ? 'number' : 'text'}
                value={condition.value !== undefined ? String(condition.value) : ''}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={`Enter ${selectedAttribute?.type || 'value'}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
