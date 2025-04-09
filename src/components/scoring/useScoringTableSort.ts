
import { useState } from 'react';
import { ScoringRule, BusinessUnit } from '@/types/scoringTypes';

export const useScoringTableSort = (rules: ScoringRule[], businessUnits: BusinessUnit[]) => {
  const [sortField, setSortField] = useState<keyof ScoringRule>('business_unit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const getBusinessUnitName = (id: string) => {
    return businessUnits.find(bu => bu.id === id)?.name || id;
  };

  const handleSort = (field: keyof ScoringRule) => {
    if (sortField === field) {
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const dummyRules = [
    {
      id: "car-rule",
      business_unit: "motor",
      description: "Car High propensity lead",
      criteria: "vehicle_type = 'Car' AND visit_frequency > 3",
      weight: 85,
      isSQL: true,
      version: "1.2"
    },
    {
      id: "bike-rule",
      business_unit: "motor",
      description: "Bike High propensity lead",
      criteria: "vehicle_type = 'Bike' AND visit_frequency > 2",
      weight: 80,
      isSQL: true,
      version: "1.0"
    },
    {
      id: "health-rule",
      business_unit: "health",
      description: "Health high propensity lead",
      criteria: "age BETWEEN 25 AND 45 AND has_dependents = true",
      weight: 90,
      isSQL: true,
      version: "2.1"
    },
    {
      id: "life-rule",
      business_unit: "life",
      description: "Life high propensity lead",
      criteria: "income > 1000000 AND marital_status = 'Married'",
      weight: 95,
      isSQL: false,
      version: "1.5"
    },
    {
      id: "travel-rule",
      business_unit: "travel",
      description: "Travel high propensity lead",
      criteria: "travel_frequency > 3 AND passport_holder = true",
      weight: 75,
      isSQL: true,
      version: "1.1"
    }
  ];

  const sortedRules = [...(rules.length === 0 ? dummyRules : rules)].sort((a, b) => {
    if (sortField === 'business_unit') {
      const aName = getBusinessUnitName(a.business_unit);
      const bName = getBusinessUnitName(b.business_unit);
      return sortDirection === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    
    if (sortField === 'weight') {
      return sortDirection === 'asc' 
        ? a.weight - b.weight
        : b.weight - a.weight;
    }
    
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedRules
  };
};
