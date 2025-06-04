
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RuleCondition, AttributeDefinition, EventDefinition, ConditionOperator } from '@/types/leadIngestionTypes';
import { getOperatorOptions, getOperatorLabel } from './utils/ruleOperators';

interface RuleConditionWithType extends RuleCondition {
  sourceType: 'event' | 'attribute';
}

interface RuleConditionBuilderProps {
  condition: RuleConditionWithType;
  index: number;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onUpdate: (id: string, updates: Partial<RuleConditionWithType>) => void;
  onRemove: (id: string) => void;
}

export const RuleConditionBuilder = ({
  condition,
  index,
  attributes,
  events,
  onUpdate,
  onRemove
}: RuleConditionBuilderProps) => {
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
    <div className="border p-4 rounded-md space-y-4">
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
          onClick={() => onRemove(condition.id)}
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
              onUpdate(condition.id, { 
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
              onUpdate(condition.id, { 
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
                onUpdate(condition.id, { 
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
                  
                  onUpdate(condition.id, { value });
                }}
                placeholder="Enter value"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
