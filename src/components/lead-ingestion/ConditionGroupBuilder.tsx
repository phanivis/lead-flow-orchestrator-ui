
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, Plus, Trash2, Brackets } from 'lucide-react';
import { RuleConditionBuilder } from './RuleConditionBuilder';
import { AttributeDefinition, EventDefinition, LogicalOperator, ConditionGroup, RuleCondition } from '@/types/leadIngestionTypes';

interface RuleConditionWithType extends RuleCondition {
  sourceType?: 'event' | 'attribute';
}

interface ConditionGroupWithType extends Omit<ConditionGroup, 'conditions' | 'subGroups'> {
  conditions: RuleConditionWithType[];
  subGroups: ConditionGroupWithType[];
}

interface ConditionGroupBuilderProps {
  group: ConditionGroupWithType;
  groupIndex: number;
  depth?: number;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onUpdateGroup: (groupId: string, updates: Partial<ConditionGroup>) => void;
  onRemoveGroup: (groupId: string) => void;
  onAddCondition: (groupId: string) => void;
  onUpdateCondition: (groupId: string, conditionId: string, updates: Partial<RuleCondition>) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
  onAddSubGroup: (groupId: string) => void;
  onRemoveSubGroup: (groupId: string, subGroupId: string) => void;
  onUpdateSubGroup: (groupId: string, subGroupId: string, updates: Partial<ConditionGroup>) => void;
  onAddConditionToSubGroup: (groupId: string, subGroupId: string) => void;
  onUpdateConditionInSubGroup: (groupId: string, subGroupId: string, conditionId: string, updates: Partial<RuleCondition>) => void;
  onRemoveConditionFromSubGroup: (groupId: string, subGroupId: string, conditionId: string) => void;
}

export const ConditionGroupBuilder = ({
  group,
  groupIndex,
  depth = 0,
  attributes,
  events,
  onUpdateGroup,
  onRemoveGroup,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  onAddSubGroup,
  onRemoveSubGroup,
  onUpdateSubGroup,
  onAddConditionToSubGroup,
  onUpdateConditionInSubGroup,
  onRemoveConditionFromSubGroup
}: ConditionGroupBuilderProps) => {
  const handleOperatorChange = (operator: LogicalOperator) => {
    onUpdateGroup(group.id, { operator });
  };

  const handleConditionUpdate = (conditionId: string, updates: any) => {
    onUpdateCondition(group.id, conditionId, updates);
  };

  const maxDepth = 3;
  const canAddSubGroups = depth < maxDepth;

  return (
    <Card className={`p-4 space-y-4 ${depth > 0 ? 'ml-4 border-l-4 border-l-primary/30' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {depth === 0 ? `Group ${groupIndex + 1}` : `Sub-group ${groupIndex + 1}`}
          </span>
          {(group.conditions.length > 1 || group.subGroups.length > 0) && (
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

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {/* Render conditions */}
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
                  index={conditionIndex}
                  attributes={attributes}
                  events={events}
                  onUpdate={(id, updates) => handleConditionUpdate(id, updates)}
                  onRemove={(id) => onRemoveCondition(group.id, id)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Render sub-groups */}
        {group.subGroups.map((subGroup, subGroupIndex) => (
          <div key={subGroup.id}>
            {(group.conditions.length > 0 || subGroupIndex > 0) && (
              <div className="flex justify-center py-2">
                <Badge variant="default" className="text-sm font-medium flex items-center gap-1">
                  <Brackets className="h-3 w-3" />
                  {group.operator}
                  <Brackets className="h-3 w-3" />
                </Badge>
              </div>
            )}
            <ConditionGroupBuilder
              group={subGroup}
              groupIndex={subGroupIndex}
              depth={depth + 1}
              attributes={attributes}
              events={events}
              onUpdateGroup={(subGroupId, updates) => onUpdateSubGroup(group.id, subGroupId, updates)}
              onRemoveGroup={(subGroupId) => onRemoveSubGroup(group.id, subGroupId)}
              onAddCondition={(subGroupId) => onAddConditionToSubGroup(group.id, subGroupId)}
              onUpdateCondition={(subGroupId, conditionId, updates) => 
                onUpdateConditionInSubGroup(group.id, subGroupId, conditionId, updates)
              }
              onRemoveCondition={(subGroupId, conditionId) => 
                onRemoveConditionFromSubGroup(group.id, subGroupId, conditionId)
              }
              onAddSubGroup={onAddSubGroup}
              onRemoveSubGroup={onRemoveSubGroup}
              onUpdateSubGroup={onUpdateSubGroup}
              onAddConditionToSubGroup={onAddConditionToSubGroup}
              onUpdateConditionInSubGroup={onUpdateConditionInSubGroup}
              onRemoveConditionFromSubGroup={onRemoveConditionFromSubGroup}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddCondition(group.id)}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
        {canAddSubGroups && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSubGroup(group.id)}
            className="flex-1"
          >
            <Brackets className="h-4 w-4 mr-2" />
            Add Sub-group
          </Button>
        )}
      </div>
    </Card>
  );
};
