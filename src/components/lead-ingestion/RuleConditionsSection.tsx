
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { EventDefinition, RuleCondition } from '@/types/leadIngestionTypes';
import { RuleConditionItem } from './RuleConditionItem';

interface RuleConditionsSectionProps {
  conditions: RuleCondition[];
  events: EventDefinition[];
  onAddCondition: () => void;
  onRemoveCondition: (id: string) => void;
  onUpdateCondition: (id: string, updates: Partial<RuleCondition>) => void;
}

export const RuleConditionsSection = ({
  conditions,
  events,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}: RuleConditionsSectionProps) => {
  return (
    <div className="space-y-4">
      {conditions.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-muted-foreground">No conditions added yet</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={onAddCondition}
          >
            Add Your First Condition
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <RuleConditionItem
              key={condition.id}
              condition={condition}
              index={index}
              events={events}
              onRemove={onRemoveCondition}
              onUpdate={onUpdateCondition}
            />
          ))}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={onAddCondition}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      )}
    </div>
  );
};
