
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Parentheses } from 'lucide-react';
import { ConditionGroupBuilder } from './ConditionGroupBuilder';
import { AttributeDefinition, EventDefinition, LogicalOperator, ConditionGroup, RuleCondition } from '@/types/leadIngestionTypes';

interface RuleConditionWithType extends RuleCondition {
  sourceType?: 'event' | 'attribute';
}

interface ConditionGroupWithType extends Omit<ConditionGroup, 'conditions'> {
  conditions: RuleConditionWithType[];
}

interface NestedConditionBuilderProps {
  conditionGroups: ConditionGroupWithType[];
  rootOperator: LogicalOperator;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onUpdateRootOperator: (operator: LogicalOperator) => void;
  onUpdateGroup: (groupId: string, updates: Partial<ConditionGroup>) => void;
  onRemoveGroup: (groupId: string) => void;
  onAddGroup: () => void;
  onAddCondition: (groupId: string) => void;
  onUpdateCondition: (groupId: string, conditionId: string, updates: Partial<RuleCondition>) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
}

export const NestedConditionBuilder = ({
  conditionGroups,
  rootOperator,
  attributes,
  events,
  onUpdateRootOperator,
  onUpdateGroup,
  onRemoveGroup,
  onAddGroup,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition
}: NestedConditionBuilderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Rule Conditions</h3>
        {conditionGroups.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Groups connected by:</span>
            <Select value={rootOperator} onValueChange={onUpdateRootOperator}>
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

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {conditionGroups.map((group, index) => (
          <div key={group.id}>
            {index > 0 && conditionGroups.length > 1 && (
              <div className="flex justify-center py-2">
                <Badge variant="default" className="text-sm font-medium flex items-center gap-1">
                  <Parentheses className="h-3 w-3" />
                  {rootOperator}
                  <Parentheses className="h-3 w-3" />
                </Badge>
              </div>
            )}
            <ConditionGroupBuilder
              group={group}
              groupIndex={index}
              attributes={attributes}
              events={events}
              onUpdateGroup={onUpdateGroup}
              onRemoveGroup={onRemoveGroup}
              onAddCondition={onAddCondition}
              onUpdateCondition={onUpdateCondition}
              onRemoveCondition={onRemoveCondition}
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onAddGroup}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition Group
      </Button>
    </div>
  );
};
