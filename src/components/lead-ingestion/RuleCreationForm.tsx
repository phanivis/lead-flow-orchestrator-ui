
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus } from 'lucide-react';
import { RuleCondition, AttributeDefinition, EventDefinition } from '@/types/leadIngestionTypes';
import { TimePeriodConfig } from './TimePeriodConfig';
import { RuleConditionBuilder } from './RuleConditionBuilder';

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
    eventTimePeriodType?: string;
    eventTimeConfigValue?: number;
    retargetTimePeriodType?: string;
    retargetTimeConfigValue?: number;
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
  const [eventTimePeriodType, setEventTimePeriodType] = useState<string>('');
  const [eventTimeConfigValue, setEventTimeConfigValue] = useState<number | ''>('');
  const [retargetTimePeriodType, setRetargetTimePeriodType] = useState<string>('');
  const [retargetTimeConfigValue, setRetargetTimeConfigValue] = useState<number | ''>('');

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
      conditions: conditions.map(({ sourceType, ...rest }) => rest),
      eventTimePeriodType,
      eventTimeConfigValue: eventTimeConfigValue === '' ? undefined : Number(eventTimeConfigValue),
      retargetTimePeriodType,
      retargetTimeConfigValue: retargetTimeConfigValue === '' ? undefined : Number(retargetTimeConfigValue)
    });
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
              <RuleConditionBuilder
                key={condition.id}
                condition={condition}
                index={index}
                attributes={attributes}
                events={events}
                onUpdate={handleUpdateCondition}
                onRemove={handleRemoveCondition}
              />
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
