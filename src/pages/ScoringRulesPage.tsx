
import React, { useState } from 'react';
import { 
  Plus, 
  Star, 
  ChevronDown, 
  Play, 
  FileCheck, 
  AlertCircle, 
  Copy,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  Edit,
  Calendar,
  RepeatIcon,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RuleFrequency {
  enabled: boolean;
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  maxCount?: number;
  period?: number; // in days (for custom type)
}

interface RuleExpiry {
  enabled: boolean;
  date?: string;
}

interface ScoringRule {
  id: string;
  name: string;
  description: string;
  conditions: RuleCondition[];
  action: RuleAction;
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  version: number;
  createdAt: string;
  frequency: RuleFrequency;
  expiry: RuleExpiry;
}

interface RuleCondition {
  attribute: string;
  operator: string;
  value: string;
  conjunction?: 'AND' | 'OR';
}

interface RuleAction {
  type: 'score';
  value: number;
}

const ScoringRulesPage = () => {
  const [rules, setRules] = useState<ScoringRule[]>([
    {
      id: '1',
      name: 'High-intent Website Visitor',
      description: 'Increase score for visitors who checked the pricing page',
      conditions: [
        { attribute: 'page_visits', operator: 'contains', value: '/pricing' }
      ],
      action: { type: 'score', value: 10 },
      status: 'active',
      priority: 1,
      version: 1,
      createdAt: '2025-03-15',
      frequency: { enabled: false, type: 'once' },
      expiry: { enabled: false }
    },
    {
      id: '2',
      name: 'Enterprise Lead',
      description: 'Higher score for enterprise customers',
      conditions: [
        { attribute: 'company_size', operator: 'greater_than', value: '500' },
        { conjunction: 'AND', attribute: 'product_interest', operator: 'equals', value: 'Enterprise Plan' }
      ],
      action: { type: 'score', value: 20 },
      status: 'active',
      priority: 2,
      version: 3,
      createdAt: '2025-03-10',
      frequency: { enabled: true, type: 'once' },
      expiry: { enabled: false }
    },
    {
      id: '3',
      name: 'Form Submitter',
      description: 'Increase score for users who submitted contact form',
      conditions: [
        { attribute: 'form_submitted', operator: 'equals', value: 'true' }
      ],
      action: { type: 'score', value: 15 },
      status: 'inactive',
      priority: 3,
      version: 1,
      createdAt: '2025-03-05',
      frequency: { enabled: true, type: 'daily', maxCount: 1 },
      expiry: { enabled: true, date: '2025-06-30' }
    }
  ]);
  
  const [editingRule, setEditingRule] = useState<ScoringRule | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  
  // Sample attributes for the condition builder
  const availableAttributes = [
    'page_visits', 'company_size', 'product_interest', 'form_submitted',
    'email_domain', 'visit_count', 'time_on_site', 'lead_source',
    'country', 'industry', 'job_title', 'campaign_source'
  ];
  
  // Sample operators
  const operators = {
    string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with'],
    number: ['equals', 'not_equals', 'greater_than', 'less_than', 'between'],
    boolean: ['equals', 'not_equals'],
    date: ['equals', 'not_equals', 'before', 'after', 'between']
  };
  
  // Sample test lead
  const testLead = {
    name: 'John Smith',
    email: 'john.smith@acme.com',
    page_visits: ['/home', '/products', '/pricing', '/contact'],
    company_size: '750',
    product_interest: 'Enterprise Plan',
    form_submitted: 'true',
    visit_count: '5',
    time_on_site: '324',
    lead_source: 'Google Search',
    country: 'United States',
    industry: 'Technology',
    job_title: 'CTO'
  };
  
  const handleCreateRule = () => {
    const newRule: ScoringRule = {
      id: (rules.length + 1).toString(),
      name: 'New Rule',
      description: 'Rule description',
      conditions: [{ attribute: '', operator: '', value: '' }],
      action: { type: 'score', value: 0 },
      status: 'draft',
      priority: rules.length + 1,
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
      frequency: { enabled: false, type: 'once' },
      expiry: { enabled: false }
    };
    
    setEditingRule(newRule);
    setIsRuleDialogOpen(true);
  };
  
  const handleEditRule = (rule: ScoringRule) => {
    setEditingRule({ ...rule });
    setIsRuleDialogOpen(true);
  };
  
  const handleSaveRule = () => {
    if (!editingRule) return;
    
    // Validation
    if (!editingRule.name.trim()) {
      toast.error('Rule name is required');
      return;
    }
    
    if (editingRule.conditions.some(c => !c.attribute || !c.operator || !c.value)) {
      toast.error('All conditions must be complete');
      return;
    }
    
    // Frequency validation
    if (editingRule.frequency.enabled) {
      if (editingRule.frequency.type === 'custom' && (!editingRule.frequency.maxCount || !editingRule.frequency.period)) {
        toast.error('Custom frequency requires max count and period values');
        return;
      }
      
      if (['daily', 'weekly', 'monthly'].includes(editingRule.frequency.type) && !editingRule.frequency.maxCount) {
        toast.error(`Please specify max count for ${editingRule.frequency.type} frequency`);
        return;
      }
    }
    
    // Expiry validation
    if (editingRule.expiry.enabled && !editingRule.expiry.date) {
      toast.error('Please specify an expiry date');
      return;
    }
    
    const updatedRules = [...rules];
    const existingIndex = updatedRules.findIndex(r => r.id === editingRule.id);
    
    if (existingIndex >= 0) {
      // Update existing rule
      updatedRules[existingIndex] = {
        ...editingRule,
        version: editingRule.version + 1
      };
    } else {
      // Add new rule
      updatedRules.push(editingRule);
    }
    
    setRules(updatedRules);
    setIsRuleDialogOpen(false);
    toast.success(`Rule "${editingRule.name}" saved successfully`);
  };
  
  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success('Rule deleted successfully');
  };
  
  const handleChangeRuleStatus = (ruleId: string, status: 'active' | 'inactive') => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, status } : rule
    );
    setRules(updatedRules);
    
    const statusMessage = status === 'active' ? 'activated' : 'deactivated';
    toast.success(`Rule ${statusMessage} successfully`);
  };
  
  const handleTestRule = (rule: ScoringRule) => {
    setEditingRule(rule);
    setIsTestDialogOpen(true);
  };
  
  const handleUpdateCondition = (index: number, field: keyof RuleCondition, value: string) => {
    if (!editingRule) return;
    
    const updatedConditions = [...editingRule.conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value
    };
    
    setEditingRule({
      ...editingRule,
      conditions: updatedConditions
    });
  };
  
  const handleAddCondition = () => {
    if (!editingRule) return;
    
    const updatedConditions = [...editingRule.conditions];
    updatedConditions.push({
      conjunction: 'AND',
      attribute: '',
      operator: '',
      value: ''
    });
    
    setEditingRule({
      ...editingRule,
      conditions: updatedConditions
    });
  };
  
  const handleRemoveCondition = (index: number) => {
    if (!editingRule || editingRule.conditions.length <= 1) return;
    
    const updatedConditions = [...editingRule.conditions];
    updatedConditions.splice(index, 1);
    
    setEditingRule({
      ...editingRule,
      conditions: updatedConditions
    });
  };
  
  const handleUpdateAction = (value: string) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      action: {
        ...editingRule.action,
        value: parseInt(value) || 0
      }
    });
  };
  
  const handleToggleFrequency = (enabled: boolean) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      frequency: {
        ...editingRule.frequency,
        enabled
      }
    });
  };
  
  const handleUpdateFrequency = (field: keyof RuleFrequency, value: any) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      frequency: {
        ...editingRule.frequency,
        [field]: value
      }
    });
  };
  
  const handleToggleExpiry = (enabled: boolean) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      expiry: {
        ...editingRule.expiry,
        enabled
      }
    });
  };
  
  const handleUpdateExpiry = (date: string) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      expiry: {
        ...editingRule.expiry,
        date
      }
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getFrequencyBadge = (rule: ScoringRule) => {
    if (!rule.frequency.enabled) return null;
    
    let frequencyText = '';
    switch (rule.frequency.type) {
      case 'once':
        frequencyText = 'Once per lead';
        break;
      case 'daily':
        frequencyText = `${rule.frequency.maxCount}x daily`;
        break;
      case 'weekly':
        frequencyText = `${rule.frequency.maxCount}x weekly`;
        break;
      case 'monthly':
        frequencyText = `${rule.frequency.maxCount}x monthly`;
        break;
      case 'custom':
        frequencyText = `${rule.frequency.maxCount}x per ${rule.frequency.period} days`;
        break;
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              <RepeatIcon className="h-3 w-3 mr-1" /> {frequencyText}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            Frequency limit: {frequencyText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const getExpiryBadge = (rule: ScoringRule) => {
    if (!rule.expiry.enabled || !rule.expiry.date) return null;
    
    // Check if rule is expired
    const isExpired = new Date(rule.expiry.date) < new Date();
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`ml-2 ${isExpired 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'}`}
            >
              <Timer className="h-3 w-3 mr-1" /> 
              {isExpired ? 'Expired' : format(new Date(rule.expiry.date), 'MMM d, yyyy')}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {isExpired 
              ? `Expired on ${format(new Date(rule.expiry.date), 'MMMM d, yyyy')}`
              : `Expires on ${format(new Date(rule.expiry.date), 'MMMM d, yyyy')}`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const evaluateCondition = (condition: RuleCondition, lead: any): boolean => {
    const attributeValue = lead[condition.attribute];
    
    switch (condition.operator) {
      case 'equals':
        return attributeValue === condition.value;
      case 'not_equals':
        return attributeValue !== condition.value;
      case 'contains':
        return Array.isArray(attributeValue) 
          ? attributeValue.includes(condition.value)
          : String(attributeValue).includes(condition.value);
      case 'greater_than':
        return Number(attributeValue) > Number(condition.value);
      case 'less_than':
        return Number(attributeValue) < Number(condition.value);
      // Add other operator evaluations as needed
      default:
        return false;
    }
  };
  
  const evaluateRule = (rule: ScoringRule, lead: any): boolean => {
    // Check if rule is expired
    if (rule.expiry.enabled && rule.expiry.date) {
      if (new Date(rule.expiry.date) < new Date()) {
        return false; // Rule is expired
      }
    }
    
    return rule.conditions.every((condition, index) => {
      // First condition doesn't have a conjunction
      if (index === 0) return evaluateCondition(condition, lead);
      
      // For subsequent conditions, check conjunction
      const prevResult = evaluateCondition(rule.conditions[index - 1], lead);
      const currentResult = evaluateCondition(condition, lead);
      
      return condition.conjunction === 'AND' 
        ? prevResult && currentResult 
        : prevResult || currentResult;
    });
  };
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Lead Scoring Rules</h3>
          <p className="text-muted-foreground">Create and manage rules to score leads automatically</p>
        </div>
        <Button onClick={handleCreateRule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Rule
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Priority</TableHead>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Score</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[150px]">Limits</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.priority}</TableCell>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell className="text-muted-foreground">{rule.description}</TableCell>
                    <TableCell>{rule.action.value > 0 ? `+${rule.action.value}` : rule.action.value}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadge(rule.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getFrequencyBadge(rule)}
                        {getExpiryBadge(rule)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditRule(rule)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Rule</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleTestRule(rule)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Test Rule</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleChangeRuleStatus(
                                  rule.id, 
                                  rule.status === 'active' ? 'inactive' : 'active'
                                )}
                              >
                                {rule.status === 'active' ? (
                                  <XCircle className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {rule.status === 'active' ? 'Deactivate' : 'Activate'} Rule
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Rule</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit/Create Rule Dialog */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule?.id && rules.some(r => r.id === editingRule.id) 
                ? 'Edit Scoring Rule' 
                : 'Create New Scoring Rule'
              }
            </DialogTitle>
            <DialogDescription>
              Define conditions and actions for scoring leads automatically.
            </DialogDescription>
          </DialogHeader>
          
          {editingRule && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rule Name</label>
                  <Input 
                    value={editingRule.name} 
                    onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                    placeholder="e.g., High Intent Visitor"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={editingRule.priority.toString()}
                    onValueChange={(value) => setEditingRule({
                      ...editingRule, 
                      priority: parseInt(value)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((priority) => (
                        <SelectItem key={priority} value={priority.toString()}>
                          {priority} {priority === 1 ? '(Highest)' : priority === 5 ? '(Lowest)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  value={editingRule.description} 
                  onChange={(e) => setEditingRule({...editingRule, description: e.target.value})}
                  placeholder="Briefly describe what this rule does"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Conditions</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddCondition}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Condition
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-4">
                    {editingRule.conditions.map((condition, index) => (
                      <div key={index} className="space-y-4">
                        {index > 0 && (
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={condition.conjunction || 'AND'} 
                              onValueChange={(value) => handleUpdateCondition(
                                index, 
                                'conjunction', 
                                value as 'AND' | 'OR'
                              )}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <Select 
                              value={condition.attribute} 
                              onValueChange={(value) => handleUpdateCondition(index, 'attribute', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select attribute" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableAttributes.map((attr) => (
                                  <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-3">
                            <Select 
                              value={condition.operator} 
                              onValueChange={(value) => handleUpdateCondition(index, 'operator', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.string.map((op) => (
                                  <SelectItem key={op} value={op}>
                                    {op.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-4">
                            <Input 
                              value={condition.value} 
                              onChange={(e) => handleUpdateCondition(index, 'value', e.target.value)}
                              placeholder="Value"
                            />
                          </div>
                          
                          <div className="col-span-1">
                            {index > 0 && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleRemoveCondition(index)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Adjust score by</span>
                  <Input 
                    type="number" 
                    value={editingRule.action.value} 
                    onChange={(e) => handleUpdateAction(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm">points</span>
                </div>
              </div>
              
              {/* Frequency Limits */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <RepeatIcon className="h-4 w-4 mr-2" /> Frequency Limits
                    </CardTitle>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">Enable</span>
                      <Checkbox 
                        checked={editingRule.frequency.enabled}
                        onCheckedChange={(checked) => handleToggleFrequency(checked as boolean)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  {editingRule.frequency.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Frequency Type</label>
                          <Select
                            value={editingRule.frequency.type}
                            onValueChange={(value) => handleUpdateFrequency('type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once">Once per lead</SelectItem>
                              <SelectItem value="daily">Daily limit</SelectItem>
                              <SelectItem value="weekly">Weekly limit</SelectItem>
                              <SelectItem value="monthly">Monthly limit</SelectItem>
                              <SelectItem value="custom">Custom period</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {editingRule.frequency.type !== 'once' && (
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Max Count</label>
                            <Input
                              type="number"
                              min="1"
                              value={editingRule.frequency.maxCount || ''}
                              onChange={(e) => handleUpdateFrequency('maxCount', parseInt(e.target.value) || '')}
                              placeholder="Max applications"
                            />
                          </div>
                        )}
                        
                        {editingRule.frequency.type === 'custom' && (
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Period (days)</label>
                            <Input
                              type="number"
                              min="1"
                              value={editingRule.frequency.period || ''}
                              onChange={(e) => handleUpdateFrequency('period', parseInt(e.target.value) || '')}
                              placeholder="Days"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        <Info className="h-3 w-3 inline-block mr-1" />
                        {editingRule.frequency.type === 'once' ? (
                          <span>This rule will only apply once per lead</span>
                        ) : editingRule.frequency.type === 'custom' ? (
                          <span>This rule will apply max {editingRule.frequency.maxCount || '?'} times over {editingRule.frequency.period || '?'} days</span>
                        ) : (
                          <span>This rule will apply max {editingRule.frequency.maxCount || '?'} times per {editingRule.frequency.type} period</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Expiry Settings */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Rule Expiry
                    </CardTitle>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">Enable</span>
                      <Checkbox 
                        checked={editingRule.expiry.enabled}
                        onCheckedChange={(checked) => handleToggleExpiry(checked as boolean)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  {editingRule.expiry.enabled && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Expiry Date</label>
                        <Input
                          type="date"
                          value={editingRule.expiry.date || ''}
                          onChange={(e) => handleUpdateExpiry(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        <Info className="h-3 w-3 inline-block mr-1" />
                        <span>This rule will automatically stop working after the expiry date</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>Save Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Test Rule Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test Rule: {editingRule?.name}</DialogTitle>
            <DialogDescription>
              See how this rule would score a sample lead.
            </DialogDescription>
          </DialogHeader>
          
          {editingRule && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Rule Definition</h4>
                  <Card>
                    <CardContent className="p-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground">If</span>
                          {editingRule.conditions.map((condition, index) => (
                            <div key={index} className="ml-4 mt-1">
                              {index > 0 && (
                                <span className="text-muted-foreground">
                                  {condition.conjunction}
                                </span>
                              )}
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="mr-2">
                                  {condition.attribute}
                                </Badge>
                                <span className="mr-2">{condition.operator.replace('_', ' ')}</span>
                                <Badge className="bg-secondary text-foreground">
                                  {condition.value}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Then</span>
                          <div className="ml-4 mt-1">
                            <span>
                              Adjust score by{' '}
                              <Badge className="bg-primary">
                                {editingRule.action.value > 0 ? '+' : ''}
                                {editingRule.action.value}
                              </Badge>
                            </span>
                          </div>
                        </div>
                        
                        {/* Show frequency and expiry in test modal */}
                        {(editingRule.frequency.enabled || editingRule.expiry.enabled) && (
                          <div className="border-t pt-2 mt-2">
                            <span className="text-muted-foreground">Limits</span>
                            <div className="ml-4 mt-1">
                              {editingRule.frequency.enabled && (
                                <div className="flex items-center">
                                  <RepeatIcon className="h-3 w-3 mr-1 text-blue-600" />
                                  <span className="text-xs">
                                    {editingRule.frequency.type === 'once'
                                      ? 'Applied once per lead'
                                      : editingRule.frequency.type === 'custom'
                                        ? `Max ${editingRule.frequency.maxCount}x per ${editingRule.frequency.period} days`
                                        : `Max ${editingRule.frequency.maxCount}x ${editingRule.frequency.type}`}
                                  </span>
                                </div>
                              )}
                              
                              {editingRule.expiry.enabled && editingRule.expiry.date && (
                                <div className="flex items-center mt-1">
                                  <Calendar className="h-3 w-3 mr-1 text-amber-600" />
                                  <span className="text-xs">
                                    Expires on {format(new Date(editingRule.expiry.date), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Sample Lead</h4>
                  <Card>
                    <CardContent className="p-4 max-h-[200px] overflow-y-auto">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {Object.entries(testLead).map(([key, value]) => (
                          <div key={key} className="col-span-1">
                            <dt className="text-muted-foreground truncate">{key}</dt>
                            <dd className="font-medium truncate">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Card className={
                evaluateRule(editingRule, testLead) 
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-muted"
              }>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {evaluateRule(editingRule, testLead) ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">
                          Rule matched! Score would be adjusted by {editingRule.action.value > 0 ? '+' : ''}
                          {editingRule.action.value} points.
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium text-muted-foreground">
                          {editingRule.expiry.enabled && editingRule.expiry.date && new Date(editingRule.expiry.date) < new Date() 
                            ? "Rule is expired. No change to score." 
                            : "Rule did not match. No change to score."}
                        </span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsTestDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScoringRulesPage;
