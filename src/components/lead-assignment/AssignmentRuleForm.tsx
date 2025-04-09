
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { AssignmentRule, generateUUID } from '@/types/assignmentTypes';
import { RuleDetailsFields } from './RuleDetailsFields';
import { RuleConditionsSection } from './RuleConditionsSection';
import { assignmentRuleSchema, AssignmentRuleFormValues } from './schema/assignmentRuleSchema';

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
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RuleDetailsFields form={form} />
        <RuleConditionsSection form={form} />
        
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

// Using 'export type' for re-exporting TypeScript types when isolatedModules is enabled
export type { AssignmentRuleFormValues };
