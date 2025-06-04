
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2 } from 'lucide-react';
import { RuleCondition, AttributeDefinition, EventDefinition, ConditionOperator } from '@/types/leadIngestionTypes';
import { getOperatorOptions, getOperatorLabel } from './utils/ruleOperators';
import { Badge } from '@/components/ui/badge';

interface RuleCreationFormProps {
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  initialRule?: {
    name: string;
    description: string;
    conditions: RuleCondition[];
  };
  onSave: (rule: {
    name: string;
    description: string;
    conditions: RuleCondition[];
  }) => void;
}

interface RuleConditionWithType extends RuleCondition {
  sourceType: 'event' | 'attribute';
}

export const RuleCreationForm = ({ attributes, events, initialRule, onSave }: RuleCreationFormProps) => {
  const [name, setName] = useState(initialRule?.name || '');
  const [description, setDescription] = useState(initialRule?.description || '');
  const [conditions, setConditions] = useState<RuleConditionWithType[]>(
    initialRule?.conditions.map(c => ({ ...c, sourceType: 'attribute' })) || []
  );

  const handleAddCondition = () => {
    const newCondition: RuleConditionWithType = {
      id: `condition-${Date.now()}`,
      attributeName: '',
      operator: 'exists',
      sourceType: 'attribute'
    };
    setConditions(prev => [...prev, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(prev => prev.filter(condition => condition.id !== id));
  };

  const handleUpdateCondition = (id: string, updates: Partial<RuleConditionWithType>) => {
    setConditions(prev => 
      prev.map(condition => 
        condition.id === id ? { ...condition, ...updates } : condition
      )
    );
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      conditions: conditions.map(({ sourceType, ...rest }) => rest)
    });
  };

  const getSourceOptions = (sourceType: 'event' | 'attribute') => {
    if (sourceType === 'event') {
      return events.map(event => ({
        value: event.name,
        label: event.name,
        description: event.description
      }));
    }
    return attributes.map(attr => ({
      value: attr.name,
      label: attr.displayName,
      description: attr.description,
      type: attr.type
    }));
  };

  const getSelectedSource = (condition: RuleConditionWithType) => {
    if (condition.sourceType === 'event') {
      return events.find(e => e.name === condition.attributeName);
    }
    return attributes.find(a => a.name === condition.attributeName);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input 
            id="rule-name" 
            placeholder="Enter rule name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="rule-description">Description</Label>
          <Textarea 
            id="rule-description" 
            placeholder="Enter rule description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium">Rule Configuration</Label>
          <Button onClick={handleAddCondition} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>

        {conditions.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-muted-foreground">No conditions added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="border p-4 rounded-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        AND
                      </Badge>
                    )}
                    <span className="font-medium">Condition {index + 1}</span>
                    <Badge 
                      variant={condition.sourceType === 'event' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {condition.sourceType === 'event' ? 'Event' : 'Attribute'}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveCondition(condition.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Source Type</Label>
                    <Select
                      value={condition.sourceType}
                      onValueChange={(value: 'event' | 'attribute') => 
                        handleUpdateCondition(condition.id, { 
                          sourceType: value, 
                          attributeName: '',
                          operator: 'exists',
                          value: undefined
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attribute">Attribute</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>
                      {condition.sourceType === 'event' ? 'Event' : 'Attribute'}
                    </Label>
                    <Select
                      value={condition.attributeName}
                      onValueChange={(value) => 
                        handleUpdateCondition(condition.id, { 
                          attributeName: value,
                          operator: 'exists',
                          value: undefined
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${condition.sourceType}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getSourceOptions(condition.sourceType).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {condition.attributeName && (
                  <>
                    <div>
                      <Label>Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value: ConditionOperator) => 
                          handleUpdateCondition(condition.id, { 
                            operator: value,
                            value: value === 'exists' || value === 'not_exists' ? undefined : condition.value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getOperatorOptions(
                            condition.sourceType === 'attribute' 
                              ? attributes.find(a => a.name === condition.attributeName)?.type
                              : 'string'
                          ).map(op => (
                            <SelectItem key={op} value={op}>
                              {getOperatorLabel(op)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {condition.operator !== 'exists' && condition.operator !== 'not_exists' && (
                      <div>
                        <Label>Value</Label>
                        <Input
                          value={condition.value !== undefined ? String(condition.value) : ''}
                          onChange={(e) => {
                            let value: string | number | boolean = e.target.value;
                            const selectedSource = getSelectedSource(condition);
                            
                            if (condition.sourceType === 'attribute' && selectedSource && 'type' in selectedSource) {
                              if (selectedSource.type === 'number' && !isNaN(Number(value))) {
                                value = Number(value);
                              } else if (selectedSource.type === 'boolean') {
                                value = value.toLowerCase() === 'true';
                              }
                            }
                            
                            handleUpdateCondition(condition.id, { value });
                          }}
                          placeholder="Enter value"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Button 
        className="w-full"
        disabled={!name || conditions.length === 0}
        onClick={handleSave}
      >
        <Save className="h-4 w-4 mr-2" />
        Save Rule
      </Button>
    </div>
  );
};
