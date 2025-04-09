
import * as z from 'zod';

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
