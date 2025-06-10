
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Trash2 } from 'lucide-react';
import { RuleConditionBuilder } from './RuleConditionBuilder';
import { AttributeDefinition, EventDefinition, LogicalOperator, ConditionGroup } from '@/types/leadIngestionTypes';

interface RuleConditionWithType {
  id: string;
  attributeName: string;
  operator: string;
  value?: string | number;
  sourceType: 'event' | 'attribute';
}

interface ConditionGroupWithType extends Omit<ConditionGroup, 'conditions'> {
  conditions: RuleConditionWithType[];
}

interface ConditionGroupBuilderProps {
  group: ConditionGroupWithType;
  groupIndex: number;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onUpdateGroup: (groupId: string, updates: Partial<ConditionGroup>) => void;
  onRemoveGroup: (groupId: string) => void;
  onAddCondition: (groupId: string) => void;
  onUpdateCondition: (groupId: string, conditionId: string, updates: Partial<RuleConditionWithType>) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
  showGroupOperator?: boolean;
}

export const ConditionGroupBuilder = ({
  group,
  groupIndex,
  attributes,
  events,
  onUpdateGroup,
  onRemoveGroup,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  showGroupOperator = false
}: ConditionGroupBuilderProps) => {
  const handleOperatorChange = (operator: LogicalOperator) => {
    onUpdateGroup(group.id, { operator });
  };

  const handleConditionUpdate = (conditionId: string, updates: any) => {
    const updatesWithType = {
      ...updates,
      sourceType: updates.sourceType || 'attribute'
    };
    onUpdateCondition(group.id, conditionId, updatesWithType);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Group {groupIndex + 1}</span>
          {group.conditions.length > 1 && (
            <Select value={group.operator} onValueChange={handleOperatorChange}>
              <SelectTrigger className="w-20 h-7">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemoveGroup(group.id)}
          className="h-7 w-7 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="max-h-60">
        <div className="space-y-3">
          {group.conditions.map((condition, conditionIndex) => (
            <div key={condition.id}>
              {conditionIndex > 0 && (
                <div className="flex justify-center py-1">
                  <Badge variant="secondary" className="text-xs">
                    {group.operator}
                  </Badge>
                </div>
              )}
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <RuleConditionBuilder
                    condition={{
                      ...condition,
                      sourceType: condition.sourceType || 'attribute'
                    }}
                    attributes={attributes}
                    events={events}
                    onUpdateCondition={(updates) => handleConditionUpdate(condition.id, updates)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCondition(group.id, condition.id)}
                  className="h-7 w-7 p-0 mt-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddCondition(group.id)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition
      </Button>
    </Card>
  );
};
