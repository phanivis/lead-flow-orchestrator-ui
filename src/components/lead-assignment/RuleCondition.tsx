
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { AssignmentRuleFormValues } from '@/components/lead-assignment/AssignmentRuleForm';
import { leadAttributes } from '@/data/assignmentData';
import { getOperatorsForType } from '@/types/assignmentTypes';

interface RuleConditionProps {
  form: UseFormReturn<AssignmentRuleFormValues>;
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const RuleCondition = ({ form, index, onRemove, canRemove }: RuleConditionProps) => {
  const condition = form.watch(`conditions.${index}`);
  const attributeType = leadAttributes.find(attr => attr.id === condition.attribute)?.type || '';
  const operators = getOperatorsForType(attributeType);
  const showSecondValue = condition.operator === 'between';

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end border p-3 rounded-md">
      <div className="md:col-span-3">
        <FormField
          control={form.control}
          name={`conditions.${index}.attribute`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attribute</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue(`conditions.${index}.operator`, '');
                  form.setValue(`conditions.${index}.value`, '');
                  form.setValue(`conditions.${index}.value2`, '');
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leadAttributes.map(attr => (
                    <SelectItem key={attr.id} value={attr.id}>{attr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:col-span-3">
        <FormField
          control={form.control}
          name={`conditions.${index}.operator`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operator</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!form.watch(`conditions.${index}.attribute`)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {operators.map(op => (
                    <SelectItem key={op.id} value={op.id}>{op.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className={`md:col-span-${showSecondValue ? '2' : '4'}`}>
        <FormField
          control={form.control}
          name={`conditions.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{showSecondValue ? 'Min Value' : 'Value'}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Value"
                  {...field}
                  disabled={!form.watch(`conditions.${index}.operator`)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {showSecondValue && (
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name={`conditions.${index}.value2`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Max Value"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="md:col-span-2 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
