import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, XCircle, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { RuleCondition, EventDefinition, EventProperty, ConditionOperator } from '@/types/leadIngestionTypes';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RuleBuilderProps {
  events: EventDefinition[];
  initialConditions?: RuleCondition[];
  onSave: (rule: {
    name: string;
    description: string;
    tags: string[];
    conditions: RuleCondition[];
  }) => void;
}

export const RuleBuilder = ({ events, initialConditions = [], onSave }: RuleBuilderProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [conditions, setConditions] = useState<RuleCondition[]>(initialConditions);
  const [isOpen, setIsOpen] = useState(true);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddCondition = () => {
    if (events.length === 0) return;
    
    const newCondition: RuleCondition = {
      id: `condition-${Date.now()}`,
      eventName: events[0].name,
      operator: 'exists',
    };
    
    setConditions(prev => [...prev, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(prev => prev.filter(condition => condition.id !== id));
  };

  const handleUpdateCondition = (id: string, updates: Partial<RuleCondition>) => {
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
      tags,
      conditions,
    });
  };

  const getEventProperties = (eventName: string): EventProperty[] => {
    const event = events.find(e => e.name === eventName);
    return event ? event.properties : [];
  };

  const getOperatorOptions = (propertyType?: string): ConditionOperator[] => {
    const baseOperators: ConditionOperator[] = ['exists', 'not_exists'];
    
    if (!propertyType) return baseOperators;
    
    switch (propertyType) {
      case 'string':
        return [...baseOperators, 'equals', 'not_equals', 'contains', 'not_contains', 'regex'];
      case 'number':
        return [...baseOperators, 'equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal'];
      case 'boolean':
        return [...baseOperators, 'equals', 'not_equals'];
      default:
        return baseOperators;
    }
  };

  const getOperatorLabel = (operator: ConditionOperator): string => {
    switch (operator) {
      case 'equals': return 'Equals';
      case 'not_equals': return 'Does not equal';
      case 'contains': return 'Contains';
      case 'not_contains': return 'Does not contain';
      case 'regex': return 'Matches regex';
      case 'greater_than': return 'Greater than';
      case 'less_than': return 'Less than';
      case 'greater_than_or_equal': return 'Greater than or equal to';
      case 'less_than_or_equal': return 'Less than or equal to';
      case 'exists': return 'Exists';
      case 'not_exists': return 'Does not exist';
      default: return operator;
    }
  };

  return (
    <div className="border rounded-lg p-4 h-full flex flex-col">
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
        
        <div>
          <Label htmlFor="rule-tags">Tags</Label>
          <div className="flex gap-2">
            <Input 
              id="rule-tags" 
              placeholder="Add tag" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Rule Conditions</Label>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              {conditions.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No conditions added yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handleAddCondition}
                  >
                    Add Your First Condition
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {conditions.map((condition, index) => {
                    const eventProperties = getEventProperties(condition.eventName);
                    const selectedProperty = condition.propertyName 
                      ? eventProperties.find(p => p.name === condition.propertyName) 
                      : undefined;
                    
                    return (
                      <div 
                        key={condition.id} 
                        className="p-4 border rounded-md bg-background"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Condition {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCondition(condition.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 mt-2">
                          <div>
                            <Label htmlFor={`event-${condition.id}`}>Event</Label>
                            <Select
                              value={condition.eventName}
                              onValueChange={(value) => handleUpdateCondition(condition.id, { 
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
                                value={condition.propertyName}
                                onValueChange={(value) => handleUpdateCondition(condition.id, { 
                                  propertyName: value || undefined,
                                  operator: 'exists'
                                })}
                              >
                                <SelectTrigger id={`property-${condition.id}`}>
                                  <SelectValue placeholder="Select property" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">No property (event exists)</SelectItem>
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
                              onValueChange={(value) => handleUpdateCondition(condition.id, { 
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
                                onChange={(e) => handleUpdateCondition(condition.id, { 
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
                                  handleUpdateCondition(condition.id, { 
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
                                  handleUpdateCondition(condition.id, { 
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
                  })}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddCondition}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="mt-auto pt-6">
        <Button 
          className="w-full"
          disabled={!name || conditions.length === 0}
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Rule
        </Button>
      </div>
    </div>
  );
};
