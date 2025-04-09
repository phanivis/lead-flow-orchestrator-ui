
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AssignmentRule, generateUUID } from '@/types/assignmentTypes';
import { businessUnits, sampleAssignmentRules } from '@/data/assignmentData';
import { AssignmentRuleForm, AssignmentRuleFormValues } from '@/components/lead-assignment/AssignmentRuleForm';
import { AssignmentRulesTable } from '@/components/lead-assignment/AssignmentRulesTable';

const LeadAssignmentPage: React.FC = () => {
  const [assignmentRules, setAssignmentRules] = useState<AssignmentRule[]>(sampleAssignmentRules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AssignmentRule | null>(null);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>('all');
  
  const openAddDialog = () => {
    setEditingRule(null);
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (rule: AssignmentRule) => {
    setEditingRule(rule);
    setIsAddDialogOpen(true);
  };
  
  const deleteRule = (ruleId: string) => {
    setAssignmentRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast.success('Assignment rule deleted successfully');
  };
  
  const handleSubmit = (data: AssignmentRuleFormValues) => {
    if (editingRule) {
      setAssignmentRules(prev => 
        prev.map(rule => rule.id === editingRule.id ? { ...data, id: editingRule.id } as AssignmentRule : rule)
      );
      toast.success('Assignment rule updated successfully');
    } else {
      const newRule: AssignmentRule = {
        ...data,
        id: crypto.randomUUID()
      };
      setAssignmentRules(prev => [...prev, newRule]);
      toast.success('New assignment rule created successfully');
    }
    setIsAddDialogOpen(false);
  };
  
  const filteredRules = selectedBusinessUnit === 'all' 
    ? assignmentRules 
    : assignmentRules.filter(rule => rule.businessUnit === selectedBusinessUnit);
  
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
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Rules</CardTitle>
          <CardDescription>
            Define rules for assigning leads to specific campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentRulesTable
            rules={filteredRules}
            onEdit={openEditDialog}
            onDelete={deleteRule}
          />
        </CardContent>
      </Card>
      
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
          
          <AssignmentRuleForm
            editingRule={editingRule}
            onClose={() => setIsAddDialogOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadAssignmentPage;
