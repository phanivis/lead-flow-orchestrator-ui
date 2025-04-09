
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from 'lucide-react';
import { RuleCondition } from './RuleCondition';
import { generateUUID } from '@/types/assignmentTypes';
import { AssignmentRuleFormValues } from './schema/assignmentRuleSchema';

interface RuleConditionsSectionProps {
  form: UseFormReturn<AssignmentRuleFormValues>;
}

export const RuleConditionsSection = ({ form }: RuleConditionsSectionProps) => {
  const addCondition = () => {
    const currentConditions = form.getValues('conditions');
    form.setValue('conditions', [
      ...currentConditions,
      { id: generateUUID(), attribute: '', operator: '', value: '', value2: '' }
    ]);
  };
  
  const removeCondition = (index: number) => {
    const currentConditions = form.getValues('conditions');
    if (currentConditions.length > 1) {
      form.setValue('conditions', currentConditions.filter((_, i) => i !== index));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Conditions</h3>
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="operator"
            render={({ field }) => (
              <FormItem className="space-y-0 flex items-center gap-2">
                <FormLabel className="text-sm">Match:</FormLabel>
                <div className="flex items-center space-x-4">
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="and" id="and" />
                      <FormLabel htmlFor="and" className="font-normal cursor-pointer">All conditions (AND)</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="or" id="or" />
                      <FormLabel htmlFor="or" className="font-normal cursor-pointer">Any condition (OR)</FormLabel>
                    </div>
                  </RadioGroup>
                </div>
              </FormItem>
            )}
          />
          <Button type="button" variant="outline" size="sm" onClick={addCondition}>
            <Plus className="h-4 w-4 mr-1" />
            Add Condition
          </Button>
        </div>
      </div>
      
      {form.watch('conditions').map((condition, index) => (
        <RuleCondition 
          key={condition.id}
          form={form} 
          index={index} 
          onRemove={removeCondition}
          canRemove={form.watch('conditions').length > 1}
        />
      ))}
    </div>
  );
};
