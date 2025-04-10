
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle } from 'lucide-react';
import { ConditionOperator, EventDefinition, EventProperty, RuleCondition } from '@/types/leadIngestionTypes';
import { getOperatorOptions, getOperatorLabel } from './utils/ruleOperators';

interface RuleConditionItemProps {
  condition: RuleCondition;
  index: number;
  events: EventDefinition[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<RuleCondition>) => void;
}

export const RuleConditionItem = ({
  condition,
  index,
  events,
  onRemove,
  onUpdate,
}: RuleConditionItemProps) => {
  const getEventProperties = (eventName: string): EventProperty[] => {
    const event = events.find(e => e.name === eventName);
    return event ? event.properties : [];
  };

  const eventProperties = getEventProperties(condition.eventName);
  const selectedProperty = condition.propertyName 
    ? eventProperties.find(p => p.name === condition.propertyName) 
    : undefined;

  return (
    <div 
      className="p-4 border rounded-md bg-background"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium">Condition {index + 1}</h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(condition.id)}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 mt-2">
        <div>
          <Label htmlFor={`event-${condition.id}`}>Event</Label>
          <Select
            value={condition.eventName}
            onValueChange={(value) => onUpdate(condition.id, { 
              eventName: value,
              propertyName: undefined,
              operator: 'exists'
            })}
          >
            <SelectTrigger id={`event-${condition.id}`}>
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {events.map(event => (
                <SelectItem key={event.id} value={event.name}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {eventProperties.length > 0 && (
          <div>
            <Label htmlFor={`property-${condition.id}`}>Property (optional)</Label>
            <Select
              value={condition.propertyName || "no_property"}
              onValueChange={(value) => onUpdate(condition.id, { 
                propertyName: value === "no_property" ? undefined : value,
                operator: 'exists'
              })}
            >
              <SelectTrigger id={`property-${condition.id}`}>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_property">No property (event exists)</SelectItem>
                {eventProperties.map(property => (
                  <SelectItem key={property.id} value={property.name}>
                    {property.name} ({property.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div>
          <Label htmlFor={`operator-${condition.id}`}>Operator</Label>
          <Select
            value={condition.operator}
            onValueChange={(value) => onUpdate(condition.id, { 
              operator: value as ConditionOperator
            })}
          >
            <SelectTrigger id={`operator-${condition.id}`}>
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              {getOperatorOptions(selectedProperty?.type).map(operator => (
                <SelectItem key={operator} value={operator}>
                  {getOperatorLabel(operator)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {condition.propertyName && condition.operator !== 'exists' && condition.operator !== 'not_exists' && (
          <div>
            <Label htmlFor={`value-${condition.id}`}>Value</Label>
            <Input
              id={`value-${condition.id}`}
              value={condition.value || ''}
              onChange={(e) => onUpdate(condition.id, { 
                value: e.target.value
              })}
              placeholder="Enter value"
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`time-filter-${condition.id}`}>Time Filter (days)</Label>
            <Input
              id={`time-filter-${condition.id}`}
              type="number"
              min="1"
              value={condition.timeFilter?.days || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined;
                onUpdate(condition.id, { 
                  timeFilter: value ? { days: value } : undefined
                });
              }}
              placeholder="e.g., 7"
            />
          </div>
          
          <div>
            <Label htmlFor={`count-filter-${condition.id}`}>Min Count</Label>
            <Input
              id={`count-filter-${condition.id}`}
              type="number"
              min="1"
              value={condition.countFilter?.value || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined;
                onUpdate(condition.id, { 
                  countFilter: value ? { 
                    operator: 'greater_than_or_equal', 
                    value 
                  } : undefined
                });
              }}
              placeholder="e.g., 3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
