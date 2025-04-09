import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { ScoringRulesTable } from '@/components/scoring/ScoringRulesTable';
import { BusinessUnitSelector } from '@/components/scoring/BusinessUnitSelector';
import { ScoringRuleFormDialog } from '@/components/scoring/ScoringRuleFormDialog';
import { ScoringRule, BusinessUnit, validateScoringRule } from '@/types/scoringTypes';

const ScoringRulesPage: React.FC = () => {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([
    { id: 'motor', name: 'Motor Insurance' },
    { id: 'health', name: 'Health Insurance' },
    { id: 'life', name: 'Term Life Insurance' },
    { id: 'travel', name: 'Travel Insurance' },
    { id: 'home', name: 'Home Insurance' }
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
    // Load scoring rules from localStorage or initialize with dummy data if none exists
    const storedRules = localStorage.getItem('scoringRules');
    if (storedRules) {
      setScoringRules(JSON.parse(storedRules));
    } else {
      // Initialize with dummy data for Indian D2C insurance provider
      const dummyRules: ScoringRule[] = [
        {
          id: crypto.randomUUID(),
          business_unit: 'motor',
          description: 'Two-Wheeler High Value Lead',
          criteria: 'vehicle_type = "Two Wheeler" AND vehicle_value > 100000',
          weight: 80,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'motor',
          description: 'Car in Metro City',
          criteria: 'city IN ("Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata")',
          weight: 75,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'health',
          description: 'Family Floater Policy',
          criteria: 'policy_type = "Family Floater" AND members >= 3',
          weight: 85,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'health',
          description: 'Senior Citizen Lead',
          criteria: 'age > 60',
          weight: 90,
          isSQL: false,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'life',
          description: 'High Sum Assured',
          criteria: 'sum_assured >= 10000000',
          weight: 95,
          isSQL: false,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'travel',
          description: 'International Travel',
          criteria: 'destination_type = "International" AND duration > 15',
          weight: 70,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'home',
          description: 'Premium Property',
          criteria: 'property_value > 10000000 AND property_type = "Villa"',
          weight: 85,
          isSQL: true,
        }
      ];
      setScoringRules(dummyRules);
      localStorage.setItem('scoringRules', JSON.stringify(dummyRules));
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
  
  const handleSubmit = () => {
    const validation = validateScoringRule(formBusinessUnit, criteria, weight);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    
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
  };
  
  const deleteScoringRule = (id: string) => {
    const updatedRules = scoringRules.filter(rule => rule.id !== id);
    setScoringRules(updatedRules);
    toast.success("Scoring Rule deleted successfully");
  };
  
  const filteredRules = selectedBusinessUnit === 'all'
    ? scoringRules
    : scoringRules.filter(rule => rule.business_unit === selectedBusinessUnit);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scoring Rules</h1>
        <div className="flex items-center gap-2">
          <BusinessUnitSelector 
            selectedBusinessUnit={selectedBusinessUnit}
            businessUnits={businessUnits}
            onBusinessUnitChange={handleBusinessUnitChange}
          />
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
      
      <ScoringRuleFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        businessUnits={businessUnits}
        editingRule={editingRule}
        formBusinessUnit={formBusinessUnit}
        description={description}
        criteria={criteria}
        weight={weight}
        isSQL={isSQL}
        onBusinessUnitChange={handleFormBusinessUnitChange}
        onDescriptionChange={handleDescriptionChange}
        onCriteriaChange={handleCriteriaChange}
        onWeightChange={handleWeightChange}
        onRuleTypeChange={handleRuleTypeChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ScoringRulesPage;
