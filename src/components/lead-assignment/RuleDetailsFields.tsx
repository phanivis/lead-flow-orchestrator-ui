
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { businessUnits, sampleCampaigns } from '@/data/assignmentData';
import { AssignmentRuleFormValues } from './schema/assignmentRuleSchema';

interface RuleDetailsFieldsProps {
  form: UseFormReturn<AssignmentRuleFormValues>;
}

export const RuleDetailsFields = ({ form }: RuleDetailsFieldsProps) => {
  const businessUnit = form.watch('businessUnit');
  
  const campaignsForSelectedBU = businessUnit 
    ? sampleCampaigns.filter(campaign => campaign.businessUnit === businessUnit)
    : [];
  
  return (
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
  );
};
