
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { ConditionGroup, RuleCondition, AttributeDefinition, EventDefinition, LogicalOperator } from '@/types/leadIngestionTypes';
import { RuleConditionBuilder } from './RuleConditionBuilder';

interface RuleConditionWithType extends RuleCondition {
  sourceType: 'event' | 'attribute';
}

interface ConditionGroupBuilderProps {
  group: ConditionGroup & { conditions: RuleConditionWithType[] };
  groupIndex: number;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onUpdateGroup: (groupId: string, updates: Partial<ConditionGroup>) => void;
  onRemoveGroup: (groupId: string) => void;
  onAddCondition: (groupId: string) => void;
  onUpdateCondition: (groupId: string, conditionId: string, updates: Partial<RuleConditionWithType>) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
  showGroupOperator: boolean;
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
  showGroupOperator
}: ConditionGroupBuilderProps) => {
  return (
    <div className="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {showGroupOperator && groupIndex > 0 && (
            <Badge variant="secondary" className="text-sm">
              OR
            </Badge>
          )}
          <span className="font-medium">Group {groupIndex + 1}</span>
          {group.conditions.length > 1 && (
            <Select
              value={group.operator}
              onValueChange={(value: LogicalOperator) => 
                onUpdateGroup(group.id, { operator: value })
              }
            >
              <SelectTrigger className="w-20">
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
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {group.conditions.map((condition, conditionIndex) => (
          <div key={condition.id} className="relative">
            {conditionIndex > 0 && (
              <div className="flex justify-center mb-2">
                <Badge variant="outline" className="text-xs">
                  {group.operator}
                </Badge>
              </div>
            )}
            <RuleConditionBuilder
              condition={condition}
              index={conditionIndex}
              attributes={attributes}
              events={events}
              onUpdate={(conditionId, updates) => 
                onUpdateCondition(group.id, conditionId, updates)
              }
              onRemove={(conditionId) => 
                onRemoveCondition(group.id, conditionId)
              }
            />
          </div>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onAddCondition(group.id)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition to Group
        </Button>
      </div>
    </div>
  );
};
