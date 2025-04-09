
import React, { useState, useEffect } from 'react';
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Code, Calculator, Edit, Plus, Save, Trash2 } from 'lucide-react';
import { ScoringRulesTable } from '@/components/scoring/ScoringRulesTable';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ScoringRule = {
  id: string;
  business_unit: string;
  description: string;
  criteria: string;
  weight: number;
  isSQL: boolean;
};

type BusinessUnit = {
  id: string;
  name: string;
};

const ScoringRulesPage: React.FC = () => {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([
    { id: 'car', name: 'Car Insurance' },
    { id: 'bike', name: 'Bike Insurance' },
    { id: 'life', name: 'Life Insurance' },
    { id: 'health', name: 'Health Insurance' },
    { id: 'travel', name: 'Travel Insurance' }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>('all');
  const [editingRule, setEditingRule] = useState<ScoringRule | null>(null);
  
  // Form State
  const [formBusinessUnit, setFormBusinessUnit] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [isSQL, setIsSQL] = useState<boolean>(false);

  useEffect(() => {
    const storedRules = localStorage.getItem('scoringRules');
    if (storedRules) {
      setScoringRules(JSON.parse(storedRules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scoringRules', JSON.stringify(scoringRules));
  }, [scoringRules]);
  
  const openAddDialog = () => {
    setEditingRule(null);
    setFormBusinessUnit('');
    setDescription('');
    setCriteria('');
    setWeight(undefined);
    setIsSQL(false);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (rule: ScoringRule) => {
    setEditingRule(rule);
    setFormBusinessUnit(rule.business_unit);
    setDescription(rule.description || '');
    setCriteria(rule.criteria);
    setWeight(rule.weight);
    setIsSQL(rule.isSQL);
    setIsDialogOpen(true);
  };

  const handleBusinessUnitChange = (value: string) => {
    setSelectedBusinessUnit(value);
  };
  
  const handleFormBusinessUnitChange = (value: string) => {
    setFormBusinessUnit(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeight(isNaN(value) ? undefined : value);
  };

  const handleRuleTypeChange = (value: string) => {
    if (value) {
      setIsSQL(value === 'sql');
    }
  };
  
  const validateInput = (): boolean => {
    if (!formBusinessUnit) {
      toast.error("Please select a Business Unit");
      return false;
    }
    if (!criteria) {
      toast.error("Please enter a Criteria");
      return false;
    }
    if (weight === undefined) {
      toast.error("Please enter a Weight");
      return false;
    }
    if (weight <= 0 || weight > 100) {
      toast.error("Weight must be between 1 and 100");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;
    
    if (editingRule) {
      const updatedRules = scoringRules.map(rule => {
        if (rule.id === editingRule.id) {
          return {
            ...rule,
            business_unit: formBusinessUnit,
            description,
            criteria,
            weight: weight!,
            isSQL,
          };
        }
        return rule;
      });
      
      setScoringRules(updatedRules);
      toast.success("Scoring Rule updated successfully");
    } else {
      const newRule: ScoringRule = {
        id: crypto.randomUUID(),
        business_unit: formBusinessUnit,
        description,
        criteria,
        weight: weight!,
        isSQL,
      };
      
      setScoringRules([...scoringRules, newRule]);
      toast.success("Scoring Rule added successfully");
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const deleteScoringRule = (id: string) => {
    const updatedRules = scoringRules.filter(rule => rule.id !== id);
    setScoringRules(updatedRules);
    toast.success("Scoring Rule deleted successfully");
  };
  
  const resetForm = () => {
    setFormBusinessUnit('');
    setDescription('');
    setCriteria('');
    setWeight(undefined);
    setIsSQL(false);
    setEditingRule(null);
  };
  
  const filteredRules = selectedBusinessUnit === 'all'
    ? scoringRules
    : scoringRules.filter(rule => rule.business_unit === selectedBusinessUnit);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scoring Rules</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedBusinessUnit} onValueChange={handleBusinessUnitChange}>
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
          <CardTitle>Scoring Rules</CardTitle>
          <CardDescription>
            Define rules for scoring leads based on different criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScoringRulesTable
            rules={filteredRules}
            businessUnits={businessUnits}
            onEdit={openEditDialog}
            onDelete={deleteScoringRule}
          />
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Scoring Rule' : 'Create Scoring Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule 
                ? 'Modify the scoring rule details.' 
                : 'Set up rules to score leads based on specific criteria.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="business-unit" className="flex items-center">
                  Business Unit <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formBusinessUnit}
                  onValueChange={handleFormBusinessUnitChange}
                >
                  <SelectTrigger id="business-unit">
                    <SelectValue placeholder="Select a business unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this rule"
                  value={description}
                  onChange={handleDescriptionChange}
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="rule-type" className="mb-2 block">
                  Rule Type
                </Label>
                <ToggleGroup
                  type="single"
                  value={isSQL ? 'sql' : 'builder'}
                  onValueChange={handleRuleTypeChange}
                  className="justify-start"
                >
                  <ToggleGroupItem value="builder">
                    <Calculator className="h-4 w-4 mr-2" />
                    Builder
                  </ToggleGroupItem>
                  <ToggleGroupItem value="sql">
                    <Code className="h-4 w-4 mr-2" />
                    SQL
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <Label htmlFor="criteria" className="flex items-center">
                  Criteria <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="criteria"
                  placeholder={isSQL ? "Enter SQL expression" : "Enter criteria"}
                  value={criteria}
                  onChange={handleCriteriaChange}
                />
              </div>
              
              <div>
                <Label htmlFor="weight" className="flex items-center">
                  Weight (1-100) <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  min={1}
                  max={100}
                  value={weight !== undefined ? weight.toString() : ''}
                  onChange={handleWeightChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScoringRulesPage;
