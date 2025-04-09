
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Code, Calculator, ArrowDown, ArrowUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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

interface ScoringRulesTableProps {
  rules: ScoringRule[];
  businessUnits: BusinessUnit[];
  onEdit: (rule: ScoringRule) => void;
  onDelete: (ruleId: string) => void;
}

export const ScoringRulesTable = ({ rules, businessUnits, onEdit, onDelete }: ScoringRulesTableProps) => {
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
      isSQL: true
    },
    {
      id: "bike-rule",
      business_unit: "motor",
      description: "Bike High propensity lead",
      criteria: "vehicle_type = 'Bike' AND visit_frequency > 2",
      weight: 80,
      isSQL: true
    },
    {
      id: "health-rule",
      business_unit: "health",
      description: "Health high propensity lead",
      criteria: "age BETWEEN 25 AND 45 AND has_dependents = true",
      weight: 90,
      isSQL: true
    },
    {
      id: "life-rule",
      business_unit: "life",
      description: "Life high propensity lead",
      criteria: "income > 1000000 AND marital_status = 'Married'",
      weight: 95,
      isSQL: false
    },
    {
      id: "travel-rule",
      business_unit: "travel",
      description: "Travel high propensity lead",
      criteria: "travel_frequency > 3 AND passport_holder = true",
      weight: 75,
      isSQL: true
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

  const getSortIcon = (field: keyof ScoringRule) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('business_unit')}
          >
            Business Unit {getSortIcon('business_unit')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('description')}
          >
            Description {getSortIcon('description')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('weight')}
          >
            Weight {getSortIcon('weight')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('isSQL')}
          >
            Type {getSortIcon('isSQL')}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRules.map(rule => (
          <TableRow key={rule.id}>
            <TableCell className="font-medium">{getBusinessUnitName(rule.business_unit)}</TableCell>
            <TableCell>{rule.description || "—"}</TableCell>
            <TableCell>{rule.weight}</TableCell>
            <TableCell>
              <Badge variant={rule.isSQL ? "secondary" : "outline"}>
                {rule.isSQL ? (
                  <><Code className="h-3 w-3 mr-1" /> SQL</>
                ) : (
                  <><Calculator className="h-3 w-3 mr-1" /> Builder</>
                )}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(rule)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the scoring rule.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(rule.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
