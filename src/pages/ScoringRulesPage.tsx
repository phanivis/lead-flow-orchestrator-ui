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
  Timer,
  Car,
  Bike,
  Heart,
  ActivitySquare,
  Plane
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  businessUnit: 'car' | 'bike' | 'life' | 'health' | 'travel';
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

// Business unit configuration with icons and color schemes
const businessUnits = [
  { id: 'car', name: 'Car', icon: Car, color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { id: 'bike', name: 'Bike', icon: Bike, color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-700' },
  { id: 'life', name: 'Life', icon: Heart, color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-700' },
  { id: 'health', name: 'Health', icon: ActivitySquare, color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-700' },
  { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-amber-500', lightColor: 'bg-amber-100', textColor: 'text-amber-700' },
];

const ScoringRulesPage = () => {
  const [activeTab, setActiveTab] = useState<string>('car');
  
  // Sample rules with business unit assignments
  const [rules, setRules] = useState<ScoringRule[]>([
    {
      id: '1',
      name: 'High-intent Website Visitor',
      description: 'Increase score for visitors who checked the pricing page',
      conditions: [
        { attribute: 'page_visits', operator: 'contains', value: '/car/pricing' }
      ],
      action: { type: 'score', value: 10 },
      status: 'active',
      priority: 1,
      version: 1,
      createdAt: '2025-03-15',
      frequency: { enabled: false, type: 'once' },
      expiry: { enabled: false },
      businessUnit: 'car'
    },
    {
      id: '2',
      name: 'Enterprise Fleet Lead',
      description: 'Higher score for enterprise fleet customers',
      conditions: [
        { attribute: 'fleet_size', operator: 'greater_than', value: '10' },
        { conjunction: 'AND', attribute: 'product_interest', operator: 'equals', value: 'Car Fleet Plan' }
      ],
      action: { type: 'score', value: 20 },
      status: 'active',
      priority: 2,
      version: 3,
      createdAt: '2025-03-10',
      frequency: { enabled: true, type: 'once' },
      expiry: { enabled: false },
      businessUnit: 'car'
    },
    {
      id: '3',
      name: 'Premium Bike Inquiry',
      description: 'Increase score for users interested in premium bikes',
      conditions: [
        { attribute: 'product_category', operator: 'equals', value: 'premium_bikes' }
      ],
      action: { type: 'score', value: 15 },
      status: 'active',
      priority: 1,
      version: 1,
      createdAt: '2025-03-12',
      frequency: { enabled: true, type: 'daily', maxCount: 1 },
      expiry: { enabled: false },
      businessUnit: 'bike'
    },
    {
      id: '4',
      name: 'Life Insurance Calculator',
      description: 'User completed life insurance calculation',
      conditions: [
        { attribute: 'calculator_usage', operator: 'equals', value: 'completed' },
        { conjunction: 'AND', attribute: 'coverage_amount', operator: 'greater_than', value: '100000' }
      ],
      action: { type: 'score', value: 25 },
      status: 'active',
      priority: 1,
      version: 1,
      createdAt: '2025-03-14',
      frequency: { enabled: false, type: 'once' },
      expiry: { enabled: false },
      businessUnit: 'life'
    },
    {
      id: '5',
      name: 'Health Checkup Inquiry',
      description: 'User requested health checkup information',
      conditions: [
        { attribute: 'form_submitted', operator: 'equals', value: 'health_checkup' }
      ],
      action: { type: 'score', value: 15 },
      status: 'active',
      priority: 2,
      version: 1,
      createdAt: '2025-03-05',
      frequency: { enabled: true, type: 'once' },
      expiry: { enabled: true, date: '2025-06-30' },
      businessUnit: 'health'
    },
    {
      id: '6',
      name: 'International Travel Quote',
      description: 'User requested international travel insurance quote',
      conditions: [
        { attribute: 'destination_type', operator: 'equals', value: 'international' },
        { conjunction: 'AND', attribute: 'coverage_type', operator: 'contains', value: 'premium' }
      ],
      action: { type: 'score', value: 20 },
      status: 'inactive',
      priority: 1,
      version: 2,
      createdAt: '2025-02-28',
      frequency: { enabled: true, type: 'monthly', maxCount: 2 },
      expiry: { enabled: false },
      businessUnit: 'travel'
    },
  ]);
  
  const [editingRule, setEditingRule] = useState<ScoringRule | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  
  // Sample attributes for the condition builder
  const attributesByBusinessUnit = {
    car: ['page_visits', 'fleet_size', 'vehicle_type', 'quote_value', 'form_submitted', 'lead_source'],
    bike: ['product_category', 'engine_size', 'bike_type', 'usage_type', 'visit_count', 'form_submitted'],
    life: ['coverage_amount', 'policy_term', 'calculator_usage', 'beneficiary_count', 'risk_profile'],
    health: ['coverage_type', 'family_size', 'pre_existing_conditions', 'form_submitted', 'plan_interest'],
    travel: ['destination_type', 'trip_duration', 'coverage_type', 'traveler_count', 'purpose_of_travel']
  };
  
  // Get attributes for current business unit
  const getAvailableAttributes = () => {
    return attributesByBusinessUnit[activeTab as keyof typeof attributesByBusinessUnit] || [];
  };
  
  // Sample operators
  const operators = {
    string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with'],
    number: ['equals', 'not_equals', 'greater_than', 'less_than', 'between'],
    boolean: ['equals', 'not_equals'],
    date: ['equals', 'not_equals', 'before', 'after', 'between']
  };
  
  // Sample test leads for each business unit
  const testLeadsByBusinessUnit = {
    car: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      page_visits: ['/car/home', '/car/products', '/car/pricing', '/car/contact'],
      fleet_size: '12',
      vehicle_type: 'SUV',
      product_interest: 'Car Fleet Plan',
      form_submitted: 'car_inquiry',
      lead_source: 'Google Search'
    },
    bike: {
      name: 'Amy Johnson',
      email: 'amy.j@gmail.com',
      product_category: 'premium_bikes',
      engine_size: '1000cc',
      bike_type: 'Sport',
      usage_type: 'Weekend Riding',
      visit_count: '3',
      form_submitted: 'test_ride'
    },
    life: {
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      coverage_amount: '250000',
      policy_term: '30',
      calculator_usage: 'completed',
      beneficiary_count: '2',
      risk_profile: 'low'
    },
    health: {
      name: 'Sarah Williams',
      email: 'sarah.w@healthco.com',
      coverage_type: 'Family',
      family_size: '4',
      pre_existing_conditions: 'none',
      form_submitted: 'health_checkup',
      plan_interest: 'Premium Health Plan'
    },
    travel: {
      name: 'David Brown',
      email: 'david.b@travel.net',
      destination_type: 'international',
      trip_duration: '14',
      coverage_type: 'premium comprehensive',
      traveler_count: '2',
      purpose_of_travel: 'Leisure'
    }
  };
  
  // Get the current test lead based on active business unit
  const getTestLead = () => {
    return testLeadsByBusinessUnit[activeTab as keyof typeof testLeadsByBusinessUnit] || {};
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
      expiry: { enabled: false },
      businessUnit: activeTab as ScoringRule['businessUnit']
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
  
  // Filter rules by active business unit
  const filteredRules = rules.filter(rule => rule.businessUnit === activeTab);
  
  const TestRuleDialog = ({ open, onOpenChange, selectedRule, businessUnit }) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Test Scoring Rule</DialogTitle>
            <DialogDescription>
              Test how {selectedRule?.name || 'this rule'} scores leads for {businessUnits.find(bu => bu.id === businessUnit)?.name || 'this business unit'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRule && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Rule Definition</h4>
                  <Card>
                    <CardContent className="p-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground">If</span>
                          {selectedRule.conditions.map((condition, index) => (
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
                                {selectedRule.action.value > 0 ? '+' : ''}
                                {selectedRule.action.value}
                              </Badge>
                            </span>
                          </div>
                        </div>
                        
                        {/* Show frequency and expiry in test modal */}
                        {(selectedRule.frequency.enabled || selectedRule.expiry.enabled) && (
                          <div className="border-t pt-2 mt-2">
                            <span className="text-muted-foreground">Limits</span>
                            <div className="ml-4 mt-1">
                              {selectedRule.frequency.enabled && (
                                <div className="flex items-center">
                                  <RepeatIcon className="h-3 w-3 mr-1 text-blue-600" />
                                  <span className="text-xs">
                                    {selectedRule.frequency.type === 'once'
                                      ? 'Applied once per lead'
                                      : selectedRule.frequency.type === 'custom'
                                        ? `Max ${selectedRule.frequency.maxCount}x per ${selectedRule.frequency.period} days`
                                        : `Max ${selectedRule.frequency.maxCount}x ${selectedRule.frequency.type}`}
                                  </span>
                                </div>
                              )}
                              
                              {selectedRule.expiry.enabled && selectedRule.expiry.date && (
                                <div className="flex items-center mt-1">
                                  <Calendar className="h-3 w-3 mr-1 text-amber-600" />
                                  <span className="text-xs">
                                    Expires on {format(new Date(selectedRule.expiry.date), 'MMMM d, yyyy')}
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
                  <h4 className="text-sm font-medium mb-2">Sample {businessUnits.find(bu => bu.id === businessUnit)?.name || ''} Lead</h4>
                  <Card>
                    <CardContent className="p-4 max-h-[200px] overflow-y-auto">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {Object.entries(getTestLead()).map(([key, value]) => (
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
                evaluateRule(selectedRule, getTestLead()) 
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-muted"
              }>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {evaluateRule(selectedRule, getTestLead()) ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">
                          Rule matched! Score would be adjusted by {selectedRule.action.value > 0 ? '+' : ''}
                          {selectedRule.action.value} points.
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium text-muted-foreground">
                          {selectedRule.expiry.enabled && selectedRule.expiry.date && new Date(selectedRule.expiry.date) < new Date() 
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
    );
  };
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Lead Scoring Rules</h3>
          <p className="text-muted-foreground">Create and manage rules to score leads automatically by business unit</p>
        </div>
        <Button onClick={handleCreateRule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Rule
        </Button>
      </div>
      
      {/* Business Unit Tabs */}
      <Tabs 
        defaultValue="car" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full flex justify-between mb-4">
          {businessUnits.map(bu => {
            const BuIcon = bu.icon;
            return (
              <TabsTrigger 
                key={bu.id} 
                value={bu.id}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <BuIcon className="h-4 w-4" />
                <span>{bu.name}</span>
                <Badge className={`ml-1 ${bu.lightColor} ${bu.textColor} border-0`}>
                  {rules.filter(r => r.businessUnit === bu.id).length}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {businessUnits.map(bu => (
          <TabsContent key={bu.id} value={bu.id} className="mt-0">
            <Card>
              <CardContent className="p-6">
                {filteredRules.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      {React.createElement(bu.icon, { className: `h-12 w-12 ${bu.textColor} opacity-20` })}
                    </div>
                    <h3 className="text-xl font-medium mb-2">No scoring rules for {bu.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first scoring rule for {bu.name} insurance to start scoring leads automatically.
                    </p>
                    <Button onClick={handleCreateRule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create {bu.name} Scoring Rule
                    </Button>
                  </div>
                ) : (
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
                        {filteredRules.map((rule) => (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Unit</label>
                <Select 
                  value={editingRule.businessUnit}
                  onValueChange={(value) => setEditingRule({
                    ...editingRule, 
                    businessUnit: value as ScoringRule['businessUnit']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnits.map((bu) => (
                      <SelectItem key={bu.id} value={bu.id}>
                        <div className="flex items-center gap-2">
                          {React.createElement(bu.icon, { className: "h-4 w-4" })}
                          <span>{bu.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                              <SelectTrigger>
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
                                {getAvailableAttributes().map((attr) => (
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
      <TestRuleDialog
        open={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        selectedRule={editingRule}
        businessUnit={activeTab}
      />
    </div>
  );
};

export default ScoringRulesPage;
