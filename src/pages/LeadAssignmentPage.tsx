
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Filter, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { dummyLeads, Lead } from '@/data/dummyLeads';

// Business units
const businessUnits = [
  { id: 'car', name: 'Car Insurance' },
  { id: 'bike', name: 'Bike Insurance' },
  { id: 'life', name: 'Life Insurance' },
  { id: 'health', name: 'Health Insurance' },
  { id: 'travel', name: 'Travel Insurance' }
];

// Sample campaign data
const sampleCampaigns = [
  { id: '1', name: 'Spring Car Insurance Campaign', description: 'Promotional campaign for new car policies', businessUnit: 'car' },
  { id: '2', name: 'Young Riders Bike Campaign', description: 'Targeting young motorcycle enthusiasts', businessUnit: 'bike' },
  { id: '3', name: 'Family Life Insurance Campaign', description: 'Focused on families with young children', businessUnit: 'life' },
  { id: '4', name: 'Summer Health Checkup', description: 'Seasonal health check promotion', businessUnit: 'health' },
  { id: '5', name: 'Holiday Travel Insurance', description: 'Coverage for summer vacation travel', businessUnit: 'travel' },
  { id: '6', name: 'Senior Safe Driving', description: 'Special rates for senior drivers', businessUnit: 'car' },
  { id: '7', name: 'Student Life Insurance', description: 'Affordable coverage for students', businessUnit: 'life' },
];

// Available lead attributes for assignment logic
const leadAttributes = [
  { id: 'city', name: 'City', type: 'string' },
  { id: 'existingPolicyHolder', name: 'Existing Policy Holder', type: 'boolean' },
  { id: 'ltv', name: 'Lifetime Value', type: 'number' },
  { id: 'leadScore', name: 'Lead Score', type: 'number' },
  { id: 'status', name: 'Status', type: 'string' },
];

// Comparison operators based on attribute type
const getOperatorsForType = (type: string) => {
  switch (type) {
    case 'string':
      return [
        { id: 'equals', label: 'Equals' },
        { id: 'contains', label: 'Contains' },
        { id: 'startsWith', label: 'Starts With' },
        { id: 'endsWith', label: 'Ends With' },
      ];
    case 'number':
      return [
        { id: 'equals', label: 'Equals' },
        { id: 'greaterThan', label: 'Greater Than' },
        { id: 'lessThan', label: 'Less Than' },
        { id: 'between', label: 'Between' },
      ];
    case 'boolean':
      return [
        { id: 'equals', label: 'Equals' },
      ];
    default:
      return [];
  }
};

interface AssignmentRule {
  id: string;
  name: string;
  businessUnit: string;
  campaign: string;
  priority: number;
  conditions: Array<{
    id: string;
    attribute: string;
    operator: string;
    value: string;
    value2?: string;
  }>;
}

// Sample assignment rules
const sampleAssignmentRules: AssignmentRule[] = [
  {
    id: '1',
    name: 'High Value Mumbai Leads',
    businessUnit: 'car',
    campaign: '1',
    priority: 1,
    conditions: [
      { id: '101', attribute: 'city', operator: 'equals', value: 'Mumbai' },
      { id: '102', attribute: 'ltv', operator: 'greaterThan', value: '5000' },
    ]
  },
  {
    id: '2',
    name: 'Existing Customers - Life',
    businessUnit: 'life',
    campaign: '3',
    priority: 2,
    conditions: [
      { id: '201', attribute: 'existingPolicyHolder', operator: 'equals', value: 'Yes' },
    ]
  },
  {
    id: '3',
    name: 'Qualified Travel Leads',
    businessUnit: 'travel',
    campaign: '5',
    priority: 3,
    conditions: [
      { id: '301', attribute: 'status', operator: 'equals', value: 'Qualified' },
      { id: '302', attribute: 'leadScore', operator: 'greaterThan', value: '70' },
    ]
  }
];

const LeadAssignmentPage: React.FC = () => {
  const [assignmentRules, setAssignmentRules] = useState<AssignmentRule[]>(sampleAssignmentRules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AssignmentRule | null>(null);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>('all');
  
  // Form for assignment rule
  const form = useForm({
    defaultValues: {
      name: '',
      businessUnit: '',
      campaign: '',
      priority: 1,
      conditions: [{ id: crypto.randomUUID(), attribute: '', operator: '', value: '', value2: '' }]
    }
  });
  
  const openAddDialog = () => {
    form.reset({
      name: '',
      businessUnit: '',
      campaign: '',
      priority: 1,
      conditions: [{ id: crypto.randomUUID(), attribute: '', operator: '', value: '', value2: '' }]
    });
    setEditingRule(null);
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (rule: AssignmentRule) => {
    setEditingRule(rule);
    form.reset({
      name: rule.name,
      businessUnit: rule.businessUnit,
      campaign: rule.campaign,
      priority: rule.priority,
      conditions: rule.conditions
    });
    setIsAddDialogOpen(true);
  };
  
  const deleteRule = (ruleId: string) => {
    setAssignmentRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast.success('Assignment rule deleted successfully');
  };
  
  const addCondition = () => {
    const currentConditions = form.getValues('conditions');
    form.setValue('conditions', [
      ...currentConditions,
      { id: crypto.randomUUID(), attribute: '', operator: '', value: '', value2: '' }
    ]);
  };
  
  const removeCondition = (index: number) => {
    const currentConditions = form.getValues('conditions');
    if (currentConditions.length > 1) {
      form.setValue('conditions', currentConditions.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    if (editingRule) {
      // Update existing rule
      setAssignmentRules(prev => 
        prev.map(rule => rule.id === editingRule.id ? { ...data, id: editingRule.id } as AssignmentRule : rule)
      );
      toast.success('Assignment rule updated successfully');
    } else {
      // Add new rule
      const newRule: AssignmentRule = {
        ...data,
        id: crypto.randomUUID()
      };
      setAssignmentRules(prev => [...prev, newRule]);
      toast.success('New assignment rule created successfully');
    }
    setIsAddDialogOpen(false);
  });
  
  // Filter rules by selected business unit
  const filteredRules = selectedBusinessUnit === 'all' 
    ? assignmentRules 
    : assignmentRules.filter(rule => rule.businessUnit === selectedBusinessUnit);
  
  // Get campaigns for selected business unit in form
  const campaignsForSelectedBU = form.watch('businessUnit') 
    ? sampleCampaigns.filter(campaign => campaign.businessUnit === form.watch('businessUnit'))
    : [];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lead Assignment</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedBusinessUnit} onValueChange={setSelectedBusinessUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by BU" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Business Units</SelectItem>
              {businessUnits.map(bu => (
                <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Rules</CardTitle>
            <CardDescription>
              Define rules for assigning leads to specific campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Business Unit</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No assignment rules found. Create your first rule to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRules.map(rule => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        {businessUnits.find(bu => bu.id === rule.businessUnit)?.name}
                      </TableCell>
                      <TableCell>
                        {sampleCampaigns.find(c => c.id === rule.campaign)?.name}
                      </TableCell>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>{rule.conditions.length} condition(s)</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(rule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Assignment Rule' : 'Create Assignment Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule 
                ? 'Modify the rule settings and conditions for assigning leads to campaigns.' 
                : 'Set up rules to automatically assign leads to specific campaigns based on criteria.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Name</FormLabel>
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
                      <FormLabel>Business Unit</FormLabel>
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
                      <FormLabel>Campaign</FormLabel>
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
                  <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Condition
                  </Button>
                </div>
                
                {form.watch('conditions').map((condition, index) => {
                  const attributeType = leadAttributes.find(attr => attr.id === condition.attribute)?.type || '';
                  const operators = getOperatorsForType(attributeType);
                  const showSecondValue = condition.operator === 'between';
                  
                  return (
                    <div key={condition.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end border p-3 rounded-md">
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
                          onClick={() => removeCondition(index)}
                          disabled={form.watch('conditions').length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadAssignmentPage;
