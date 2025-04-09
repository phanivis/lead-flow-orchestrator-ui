
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
