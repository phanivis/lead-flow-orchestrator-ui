
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { RuleCondition, EventDefinition, ConditionOperator } from '@/types/leadIngestionTypes';
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
  const [selectedEvent, setSelectedEvent] = useState<EventDefinition | undefined>(
    events.find(e => e.name === condition.eventName)
  );
  
  const [selectedProperty, setSelectedProperty] = useState<string | undefined>(
    condition.propertyName
  );
  
  const [propertyType, setPropertyType] = useState<string | undefined>();
  
  useEffect(() => {
    if (selectedEvent && selectedProperty) {
      const property = selectedEvent.properties.find(p => p.name === selectedProperty);
      if (property) {
        setPropertyType(property.type);
      }
    }
  }, [selectedEvent, selectedProperty]);
  
  const handleEventChange = (eventName: string) => {
    const event = events.find(e => e.name === eventName);
    setSelectedEvent(event);
    setSelectedProperty(undefined);
    
    onUpdate(condition.id, { 
      eventName,
      propertyName: undefined,
      operator: 'exists',
      value: undefined
    });
  };
  
  const handlePropertyChange = (propertyName: string) => {
    setSelectedProperty(propertyName);
    
    const event = selectedEvent;
    const property = event?.properties.find(p => p.name === propertyName);
    
    onUpdate(condition.id, { 
      propertyName,
      operator: 'equals',
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
    
    if (propertyType === 'number' && !isNaN(Number(value))) {
      parsedValue = Number(value);
    } else if (propertyType === 'boolean') {
      if (value.toLowerCase() === 'true') parsedValue = true;
      else if (value.toLowerCase() === 'false') parsedValue = false;
    }
    
    onUpdate(condition.id, { value: parsedValue });
  };
  
  const operatorOptions = getOperatorOptions(propertyType);
  
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
          <Label htmlFor={`event-${condition.id}`}>Event</Label>
          <Select
            value={condition.eventName}
            onValueChange={handleEventChange}
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
        
        {selectedEvent && (
          <div>
            <Label htmlFor={`property-${condition.id}`}>Property</Label>
            <Select
              value={condition.propertyName || "no_property"}
              onValueChange={handlePropertyChange}
            >
              <SelectTrigger id={`property-${condition.id}`}>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_property">Event itself</SelectItem>
                {selectedEvent.properties.map(property => (
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
            <Input
              id={`value-${condition.id}`}
              value={condition.value !== undefined ? String(condition.value) : ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={`Enter ${propertyType} value`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
