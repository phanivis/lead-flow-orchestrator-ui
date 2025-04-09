
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Plus, Save } from 'lucide-react';
import { RuleCondition } from './RuleCondition';
import { AssignmentRule, generateUUID } from '@/types/assignmentTypes';
import { businessUnits, sampleCampaigns } from '@/data/assignmentData';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const assignmentRuleSchema = z.object({
  name: z.string().min(1, { message: "Rule name is required" }),
  businessUnit: z.string().min(1, { message: "Business unit is required" }),
  campaign: z.string().min(1, { message: "Campaign is required" }),
  priority: z.number().min(1, { message: "Priority must be at least 1" }),
  operator: z.enum(['and', 'or']),
  conditions: z.array(
    z.object({
      id: z.string(),
      attribute: z.string().optional(),
      operator: z.string().optional(),
      value: z.string().optional(),
      value2: z.string().optional()
    })
  )
});

export type AssignmentRuleFormValues = z.infer<typeof assignmentRuleSchema>;

interface AssignmentRuleFormProps {
  editingRule: AssignmentRule | null;
  onClose: () => void;
  onSubmit: (data: AssignmentRuleFormValues) => void;
}

export const AssignmentRuleForm = ({ editingRule, onClose, onSubmit }: AssignmentRuleFormProps) => {
  const form = useForm<AssignmentRuleFormValues>({
    resolver: zodResolver(assignmentRuleSchema),
    defaultValues: editingRule ? {
      name: editingRule.name,
      businessUnit: editingRule.businessUnit,
      campaign: editingRule.campaign,
      priority: editingRule.priority,
      operator: editingRule.operator,
      conditions: editingRule.conditions
    } : {
      name: '',
      businessUnit: '',
      campaign: '',
      priority: 1,
      operator: 'and',
      conditions: [{ id: generateUUID(), attribute: '', operator: '', value: '', value2: '' }]
    }
  });
  
  const ruleName = form.watch('name');
  const businessUnit = form.watch('businessUnit');
  const campaign = form.watch('campaign');
  const isFormValid = ruleName && businessUnit && campaign;
  
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
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });
  
  const campaignsForSelectedBU = form.watch('businessUnit') 
    ? sampleCampaigns.filter(campaign => campaign.businessUnit === form.watch('businessUnit'))
    : [];
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Rule Name <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="High Value Leads" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for this assignment rule
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Lower numbers have higher priority
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="businessUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Business Unit <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('campaign', '');
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Business Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {businessUnits.map(bu => (
                      <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The business unit this rule applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="campaign"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Campaign <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                  disabled={!form.watch('businessUnit')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campaign" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {campaignsForSelectedBU.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The campaign to assign leads to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            <Save className="mr-2 h-4 w-4" />
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
