
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { ConditionGroupBuilder } from './ConditionGroupBuilder';
import { AttributeDefinition, EventDefinition, QualificationRule, RuleCondition, ConditionGroup, LogicalOperator } from '@/types/leadIngestionTypes';

interface ConditionGroupWithType extends Omit<ConditionGroup, 'conditions'> {
  conditions: RuleCondition[];
}

interface RuleCreationFormProps {
  selectedRule: QualificationRule | null;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onSaveRule: (ruleData: any, selectedRule: QualificationRule | null) => void;
  onActivateRule: (selectedRule: QualificationRule | null) => void;
  onConfigureAlerts: () => void;
}

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
  const [rootOperator, setRootOperator] = useState<LogicalOperator>(selectedRule?.rootOperator || 'AND');
  const [conditionGroups, setConditionGroups] = useState<ConditionGroupWithType[]>(
    selectedRule?.conditionGroups?.length ? 
      selectedRule.conditionGroups.map(group => ({
        ...group,
        conditions: group.conditions || []
      })) :
      [{
        id: `group-${Date.now()}`,
        conditions: [{
          id: `condition-${Date.now()}`,
          attributeName: '',
          operator: 'equals',
          value: ''
        }],
        operator: 'AND' as LogicalOperator
      }]
  );

  const handleSave = () => {
    const ruleData = {
      name,
      description,
      journey,
      rootOperator,
      conditionGroups: conditionGroups.map(group => ({
        ...group,
        conditions: group.conditions
      }))
    };
    onSaveRule(ruleData, selectedRule);
  };

  const addConditionGroup = () => {
    setConditionGroups(prev => [...prev, {
      id: `group-${Date.now()}`,
      conditions: [{
        id: `condition-${Date.now()}`,
        attributeName: '',
        operator: 'equals',
        value: ''
      }],
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
                  value: ''
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

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        <div className="space-y-6">
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
          </div>

          {/* Condition Groups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Rule Conditions</h3>
              {conditionGroups.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Groups connected by:</span>
                  <Select value={rootOperator} onValueChange={(value: LogicalOperator) => setRootOperator(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {conditionGroups.map((group, index) => (
                <div key={group.id}>
                  {index > 0 && conditionGroups.length > 1 && (
                    <div className="flex justify-center py-2">
                      <span className="px-3 py-1 bg-muted rounded-md text-sm font-medium">
                        {rootOperator}
                      </span>
                    </div>
                  )}
                  <ConditionGroupBuilder
                    group={group}
                    groupIndex={index}
                    attributes={attributes}
                    events={events}
                    onUpdateGroup={updateConditionGroup}
                    onRemoveGroup={removeConditionGroup}
                    onAddCondition={addCondition}
                    onUpdateCondition={updateCondition}
                    onRemoveCondition={removeCondition}
                  />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addConditionGroup}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition Group
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
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
