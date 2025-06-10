
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Plus, Layers } from 'lucide-react';
import { RuleCondition, AttributeDefinition, EventDefinition, ConditionGroup, LogicalOperator } from '@/types/leadIngestionTypes';
import { TimePeriodConfig } from './TimePeriodConfig';
import { ConditionGroupBuilder } from './ConditionGroupBuilder';

interface RuleCreationFormProps {
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  initialRule?: {
    name: string;
    description: string;
    conditions: RuleCondition[];
    conditionGroups?: ConditionGroup[];
    rootOperator?: LogicalOperator;
  };
  onSave: (rule: {
    name: string;
    description: string;
    conditions: RuleCondition[];
    conditionGroups: ConditionGroup[];
    rootOperator: LogicalOperator;
    eventTimePeriodType?: string;
    eventTimeConfigValue?: number;
    retargetTimePeriodType?: string;
    retargetTimeConfigValue?: number;
  }) => void;
}

interface RuleConditionWithType extends RuleCondition {
  sourceType: 'event' | 'attribute';
}

interface ConditionGroupWithType extends Omit<ConditionGroup, 'conditions'> {
  conditions: RuleConditionWithType[];
}

export const RuleCreationForm = ({ attributes, events, initialRule, onSave }: RuleCreationFormProps) => {
  const [name, setName] = useState(initialRule?.name || '');
  const [description, setDescription] = useState(initialRule?.description || '');
  const [conditionGroups, setConditionGroups] = useState<ConditionGroupWithType[]>(
    initialRule?.conditionGroups?.map(group => ({
      ...group,
      conditions: group.conditions.map(c => ({ ...c, sourceType: 'attribute' as const }))
    })) || []
  );
  const [rootOperator, setRootOperator] = useState<LogicalOperator>(initialRule?.rootOperator || 'AND');
  const [eventTimePeriodType, setEventTimePeriodType] = useState<string>('');
  const [eventTimeConfigValue, setEventTimeConfigValue] = useState<number | ''>('');
  const [retargetTimePeriodType, setRetargetTimePeriodType] = useState<string>('');
  const [retargetTimeConfigValue, setRetargetTimeConfigValue] = useState<number | ''>('');

  const handleAddGroup = () => {
    const newGroup: ConditionGroupWithType = {
      id: `group-${Date.now()}`,
      conditions: [],
      operator: 'AND'
    };
    setConditionGroups(prev => [...prev, newGroup]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setConditionGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const handleUpdateGroup = (groupId: string, updates: Partial<ConditionGroup>) => {
    setConditionGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  };

  const handleAddCondition = (groupId: string) => {
    const newCondition: RuleConditionWithType = {
      id: `condition-${Date.now()}`,
      attributeName: '',
      operator: 'exists',
      sourceType: 'attribute'
    };
    
    setConditionGroups(prev =>
      prev.map(group =>
        group.id === groupId 
          ? { ...group, conditions: [...group.conditions, newCondition] }
          : group
      )
    );
  };

  const handleRemoveCondition = (groupId: string, conditionId: string) => {
    setConditionGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, conditions: group.conditions.filter(c => c.id !== conditionId) }
          : group
      )
    );
  };

  const handleUpdateCondition = (groupId: string, conditionId: string, updates: Partial<RuleConditionWithType>) => {
    setConditionGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map(condition =>
                condition.id === conditionId ? { ...condition, ...updates } : condition
              )
            }
          : group
      )
    );
  };

  const handleSave = () => {
    // Convert condition groups back to the expected format
    const processedGroups: ConditionGroup[] = conditionGroups.map(group => ({
      id: group.id,
      operator: group.operator,
      conditions: group.conditions.map(({ sourceType, ...rest }) => rest)
    }));

    // Flatten all conditions for backward compatibility
    const allConditions = conditionGroups.flatMap(group => 
      group.conditions.map(({ sourceType, ...rest }) => rest)
    );

    onSave({
      name,
      description,
      conditions: allConditions,
      conditionGroups: processedGroups,
      rootOperator,
      eventTimePeriodType,
      eventTimeConfigValue: eventTimeConfigValue === '' ? undefined : Number(eventTimeConfigValue),
      retargetTimePeriodType,
      retargetTimeConfigValue: retargetTimeConfigValue === '' ? undefined : Number(retargetTimeConfigValue)
    });
  };

  const hasConditions = conditionGroups.some(group => group.conditions.length > 0);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4">
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

          <TimePeriodConfig
            eventTimePeriodType={eventTimePeriodType}
            eventTimeConfigValue={eventTimeConfigValue}
            retargetTimePeriodType={retargetTimePeriodType}
            retargetTimeConfigValue={retargetTimeConfigValue}
            onEventTimePeriodTypeChange={setEventTimePeriodType}
            onEventTimeConfigValueChange={setEventTimeConfigValue}
            onRetargetTimePeriodTypeChange={setRetargetTimePeriodType}
            onRetargetTimeConfigValueChange={setRetargetTimeConfigValue}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Rule Configuration</Label>
              <Button onClick={handleAddGroup} variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Add Condition Group
              </Button>
            </div>

            {conditionGroups.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No condition groups added yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add groups to create complex logical expressions like (A AND B) OR (C AND D)
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-96 pr-4">
                <div className="space-y-4">
                  {conditionGroups.map((group, index) => (
                    <div key={group.id}>
                      {index > 0 && (
                        <div className="flex justify-center py-2">
                          <Badge variant="default" className="text-sm">
                            OR
                          </Badge>
                        </div>
                      )}
                      <ConditionGroupBuilder
                        group={group}
                        groupIndex={index}
                        attributes={attributes}
                        events={events}
                        onUpdateGroup={handleUpdateGroup}
                        onRemoveGroup={handleRemoveGroup}
                        onAddCondition={handleAddCondition}
                        onUpdateCondition={handleUpdateCondition}
                        onRemoveCondition={handleRemoveCondition}
                        showGroupOperator={index > 0}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </ScrollArea>
      
      <div className="pt-4 border-t mt-4">
        <Button 
          className="w-full"
          disabled={!name || !hasConditions}
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Rule
        </Button>
      </div>
    </div>
  );
};
