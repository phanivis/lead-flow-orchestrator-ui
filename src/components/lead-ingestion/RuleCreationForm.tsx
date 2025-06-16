import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NestedConditionBuilder } from './NestedConditionBuilder';
import { AttributeDefinition, EventDefinition, QualificationRule, RuleCondition, ConditionGroup, LogicalOperator } from '@/types/leadIngestionTypes';

interface RuleConditionWithType extends RuleCondition {
  sourceType?: 'event' | 'attribute';
}

interface ConditionGroupWithType extends Omit<ConditionGroup, 'conditions' | 'subGroups'> {
  conditions: RuleConditionWithType[];
  subGroups: ConditionGroupWithType[];
}

interface RuleCreationFormProps {
  selectedRule: QualificationRule | null;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onSaveRule: (ruleData: any, selectedRule: QualificationRule | null) => void;
  onActivateRule: (selectedRule: QualificationRule | null) => void;
  onConfigureAlerts: () => void;
}

const uniqueLeadAttributes = [
  'Email',
  'Phone Number',
  'Mobile Number',
  'PAN Number',
  'Aadhaar Number',
  'License Number',
  'Customer ID'
];

const verticalOptions = [
  'Auto',
  'Health', 
  'Life',
  'Travel',
  'ADSC',
  'Acko Drive',
  'Acko Clinic'
];

export const RuleCreationForm = ({
  selectedRule,
  attributes,
  events,
  onSaveRule,
  onActivateRule,
  onConfigureAlerts
}: RuleCreationFormProps) => {
  const [name, setName] = useState(selectedRule?.name || '');
  const [description, setDescription] = useState(selectedRule?.description || '');
  const [journey, setJourney] = useState(selectedRule?.journey || 'Car-Fresh');
  const [uniqueAttributes, setUniqueAttributes] = useState<string[]>([]);
  const [vertical, setVertical] = useState<string>('Auto');
  const [validTill, setValidTill] = useState<Date | undefined>();
  const [rootOperator, setRootOperator] = useState<LogicalOperator>(selectedRule?.rootOperator || 'AND');
  const [conditionGroups, setConditionGroups] = useState<ConditionGroupWithType[]>(
    selectedRule?.conditionGroups?.length ? 
      selectedRule.conditionGroups.map(group => ({
        ...group,
        conditions: group.conditions.map(condition => ({
          ...condition,
          sourceType: 'attribute' as const
        })) || [],
        subGroups: group.subGroups?.map(subGroup => ({
          ...subGroup,
          conditions: subGroup.conditions?.map(condition => ({
            ...condition,
            sourceType: 'attribute' as const
          })) || [],
          subGroups: subGroup.subGroups?.map(nestedSubGroup => ({
            ...nestedSubGroup,
            conditions: nestedSubGroup.conditions?.map(condition => ({
              ...condition,
              sourceType: 'attribute' as const
            })) || [],
            subGroups: nestedSubGroup.subGroups || []
          })) || []
        })) || []
      })) :
      [{
        id: `group-${Date.now()}`,
        conditions: [{
          id: `condition-${Date.now()}`,
          attributeName: '',
          operator: 'equals',
          value: '',
          sourceType: 'attribute' as const
        }],
        subGroups: [],
        operator: 'AND' as LogicalOperator
      }]
  );

  const handleSave = () => {
    const ruleData = {
      name,
      description,
      journey,
      uniqueAttributes,
      vertical,
      validTill: validTill?.toISOString(),
      rootOperator,
      conditionGroups: conditionGroups.map(group => ({
        ...group,
        conditions: group.conditions.map(({ sourceType, ...condition }) => condition),
        subGroups: group.subGroups.map(subGroup => ({
          ...subGroup,
          conditions: subGroup.conditions.map(({ sourceType, ...condition }) => condition),
          subGroups: subGroup.subGroups?.map(nestedSubGroup => ({
            ...nestedSubGroup,
            conditions: nestedSubGroup.conditions?.map(({ sourceType, ...condition }) => condition) || [],
            subGroups: nestedSubGroup.subGroups || []
          })) || []
        }))
      }))
    };
    onSaveRule(ruleData, selectedRule);
  };

  const addUniqueAttribute = (attribute: string) => {
    if (!uniqueAttributes.includes(attribute)) {
      setUniqueAttributes([...uniqueAttributes, attribute]);
    }
  };

  const removeUniqueAttribute = (attribute: string) => {
    setUniqueAttributes(uniqueAttributes.filter(attr => attr !== attribute));
  };

  const addConditionGroup = () => {
    setConditionGroups(prev => [...prev, {
      id: `group-${Date.now()}`,
      conditions: [{
        id: `condition-${Date.now()}`,
        attributeName: '',
        operator: 'equals',
        value: '',
        sourceType: 'attribute' as const
      }],
      subGroups: [],
      operator: 'AND' as LogicalOperator
    }]);
  };

  const removeConditionGroup = (groupId: string) => {
    if (conditionGroups.length > 1) {
      setConditionGroups(prev => prev.filter(group => group.id !== groupId));
    }
  };

  const updateConditionGroup = (groupId: string, updates: Partial<ConditionGroup>) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  };

  const addCondition = (groupId: string) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              conditions: [
                ...group.conditions,
                {
                  id: `condition-${Date.now()}`,
                  attributeName: '',
                  operator: 'equals',
                  value: '',
                  sourceType: 'attribute' as const
                }
              ]
            }
          : group
      )
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              conditions: group.conditions.filter(condition => condition.id !== conditionId)
            }
          : group
      )
    );
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<RuleCondition>) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              conditions: group.conditions.map(condition => 
                condition.id === conditionId 
                  ? { ...condition, ...updates }
                  : condition
              )
            }
          : group
      )
    );
  };

  // Sub-group operations
  const addSubGroup = (groupId: string) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              subGroups: [
                ...group.subGroups,
                {
                  id: `subgroup-${Date.now()}`,
                  conditions: [{
                    id: `condition-${Date.now()}`,
                    attributeName: '',
                    operator: 'equals',
                    value: '',
                    sourceType: 'attribute' as const
                  }],
                  subGroups: [],
                  operator: 'AND' as LogicalOperator
                }
              ]
            }
          : group
      )
    );
  };

  const removeSubGroup = (groupId: string, subGroupId: string) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              subGroups: group.subGroups.filter(subGroup => subGroup.id !== subGroupId)
            }
          : group
      )
    );
  };

  const updateSubGroup = (groupId: string, subGroupId: string, updates: Partial<ConditionGroup>) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              subGroups: group.subGroups.map(subGroup =>
                subGroup.id === subGroupId ? { ...subGroup, ...updates } : subGroup
              )
            }
          : group
      )
    );
  };

  const addConditionToSubGroup = (groupId: string, subGroupId: string) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              subGroups: group.subGroups.map(subGroup =>
                subGroup.id === subGroupId 
                  ? {
                      ...subGroup,
                      conditions: [
                        ...subGroup.conditions,
                        {
                          id: `condition-${Date.now()}`,
                          attributeName: '',
                          operator: 'equals',
                          value: '',
                          sourceType: 'attribute' as const
                        }
                      ]
                    }
                  : subGroup
              )
            }
          : group
      )
    );
  };

  const updateConditionInSubGroup = (groupId: string, subGroupId: string, conditionId: string, updates: Partial<RuleCondition>) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              subGroups: group.subGroups.map(subGroup =>
                subGroup.id === subGroupId 
                  ? {
                      ...subGroup,
                      conditions: subGroup.conditions.map(condition => 
                        condition.id === conditionId 
                          ? { ...condition, ...updates }
                          : condition
                      )
                    }
                  : subGroup
              )
            }
          : group
      )
    );
  };

  const removeConditionFromSubGroup = (groupId: string, subGroupId: string, conditionId: string) => {
    setConditionGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
              ...group,
              subGroups: group.subGroups.map(subGroup =>
                subGroup.id === subGroupId 
                  ? {
                      ...subGroup,
                      conditions: subGroup.conditions.filter(condition => condition.id !== conditionId)
                    }
                  : subGroup
              )
            }
          : group
      )
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-6 pr-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter rule name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="journey">Journey</Label>
                <Select value={journey} onValueChange={setJourney}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car-Fresh">Car Fresh</SelectItem>
                    <SelectItem value="Car-Renewal">Car Renewal</SelectItem>
                    <SelectItem value="Bike-Fresh">Bike Fresh</SelectItem>
                    <SelectItem value="Bike-Renewal">Bike Renewal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vertical">Vertical</Label>
                <Select value={vertical} onValueChange={setVertical}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {verticalOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validTill">Valid Till</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !validTill && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {validTill ? format(validTill, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={validTill}
                      onSelect={setValidTill}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this rule does"
                rows={3}
              />
            </div>

            {/* Unique Lead Attributes */}
            <div className="space-y-2">
              <Label htmlFor="uniqueAttributes">Unique Lead Attributes</Label>
              <Select onValueChange={addUniqueAttribute}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unique attributes" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueLeadAttributes
                    .filter(attr => !uniqueAttributes.includes(attr))
                    .map((attribute) => (
                      <SelectItem key={attribute} value={attribute}>
                        {attribute}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {uniqueAttributes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uniqueAttributes.map((attribute) => (
                    <Badge key={attribute} variant="secondary" className="flex items-center gap-1">
                      {attribute}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeUniqueAttribute(attribute)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nested Condition Groups */}
          <NestedConditionBuilder
            conditionGroups={conditionGroups}
            rootOperator={rootOperator}
            attributes={attributes}
            events={events}
            onUpdateRootOperator={setRootOperator}
            onUpdateGroup={updateConditionGroup}
            onRemoveGroup={removeConditionGroup}
            onAddGroup={addConditionGroup}
            onAddCondition={addCondition}
            onUpdateCondition={updateCondition}
            onRemoveCondition={removeCondition}
            onAddSubGroup={addSubGroup}
            onRemoveSubGroup={removeSubGroup}
            onUpdateSubGroup={updateSubGroup}
            onAddConditionToSubGroup={addConditionToSubGroup}
            onUpdateConditionInSubGroup={updateConditionInSubGroup}
            onRemoveConditionFromSubGroup={removeConditionFromSubGroup}
          />
        </div>
      </ScrollArea>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex justify-between pt-4 border-t mt-6 flex-shrink-0">
        <Button variant="outline" onClick={onConfigureAlerts}>
          Configure Alerts
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            Save as Draft
          </Button>
          <Button onClick={() => {
            handleSave();
            onActivateRule(selectedRule);
          }}>
            Save & Activate
          </Button>
        </div>
      </div>
    </div>
  );
};
