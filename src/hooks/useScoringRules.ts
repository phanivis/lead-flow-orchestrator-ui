import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { ScoringRule, BusinessUnit, validateScoringRule } from '@/types/scoringTypes';

export const useScoringRules = () => {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [businessUnits] = useState<BusinessUnit[]>([
    { id: 'motor', name: 'Motor Insurance' },
    { id: 'health', name: 'Health Insurance' },
    { id: 'life', name: 'Term Life Insurance' },
    { id: 'travel', name: 'Travel Insurance' },
    { id: 'home', name: 'Home Insurance' }
  ]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>('all');
  
  // Load scoring rules from localStorage
  useEffect(() => {
    // Load scoring rules from localStorage or initialize with specific rules if none exists
    const storedRules = localStorage.getItem('scoringRules');
    if (storedRules) {
      setScoringRules(JSON.parse(storedRules));
    } else {
      // Initialize with specific rules
      const initialRules: ScoringRule[] = [
        {
          id: crypto.randomUUID(),
          business_unit: 'motor',
          description: 'Car High propensity lead',
          criteria: "vehicle_type = 'Car' AND visit_frequency > 3",
          weight: 85,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'motor',
          description: 'Bike High propensity lead',
          criteria: "vehicle_type = 'Bike' AND visit_frequency > 2",
          weight: 80,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'health',
          description: 'Health high propensity lead',
          criteria: "age BETWEEN 25 AND 45 AND has_dependents = true",
          weight: 90,
          isSQL: true,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'life',
          description: 'Life high propensity lead',
          criteria: "income > 1000000 AND marital_status = 'Married'",
          weight: 95,
          isSQL: false,
        },
        {
          id: crypto.randomUUID(),
          business_unit: 'travel',
          description: 'Travel high propensity lead',
          criteria: "travel_frequency > 3 AND passport_holder = true",
          weight: 75,
          isSQL: true,
        }
      ];
      setScoringRules(initialRules);
      localStorage.setItem('scoringRules', JSON.stringify(initialRules));
    }
  }, []);

  // Save scoring rules to localStorage when they change
  useEffect(() => {
    localStorage.setItem('scoringRules', JSON.stringify(scoringRules));
  }, [scoringRules]);

  // Filter rules based on selected business unit
  const filteredRules = selectedBusinessUnit === 'all'
    ? scoringRules
    : scoringRules.filter(rule => rule.business_unit === selectedBusinessUnit);

  // Handle business unit change for filtering
  const handleBusinessUnitChange = (value: string) => {
    setSelectedBusinessUnit(value);
  };
  
  // Add a new scoring rule
  const addScoringRule = (rule: Omit<ScoringRule, 'id'>) => {
    const validation = validateScoringRule(rule.business_unit, rule.criteria, rule.weight);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return false;
    }
    
    const newRule: ScoringRule = {
      id: crypto.randomUUID(),
      ...rule
    };
    
    setScoringRules(prevRules => [...prevRules, newRule]);
    toast.success("Scoring Rule added successfully");
    return true;
  };
  
  // Update an existing scoring rule
  const updateScoringRule = (id: string, updatedRule: Omit<ScoringRule, 'id'>) => {
    const validation = validateScoringRule(updatedRule.business_unit, updatedRule.criteria, updatedRule.weight);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return false;
    }
    
    setScoringRules(prevRules => 
      prevRules.map(rule => 
        rule.id === id ? { ...updatedRule, id } : rule
      )
    );
    
    toast.success("Scoring Rule updated successfully");
    return true;
  };
  
  // Delete a scoring rule
  const deleteScoringRule = (id: string) => {
    setScoringRules(prevRules => prevRules.filter(rule => rule.id !== id));
    toast.success("Scoring Rule deleted successfully");
  };

  return {
    scoringRules,
    businessUnits,
    filteredRules,
    selectedBusinessUnit,
    handleBusinessUnitChange,
    addScoringRule,
    updateScoringRule,
    deleteScoringRule
  };
};
