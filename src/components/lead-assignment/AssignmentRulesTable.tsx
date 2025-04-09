
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { AssignmentRule } from '@/types/assignmentTypes';
import { businessUnits, sampleCampaigns } from '@/data/assignmentData';
import { Badge } from '@/components/ui/badge';

interface AssignmentRulesTableProps {
  rules: AssignmentRule[];
  onEdit: (rule: AssignmentRule) => void;
  onDelete: (ruleId: string) => void;
}

export const AssignmentRulesTable = ({ rules, onEdit, onDelete }: AssignmentRulesTableProps) => {
  const [sortField, setSortField] = useState<keyof AssignmentRule>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof AssignmentRule) => {
    if (sortField === field) {
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof AssignmentRule) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  const sortedRules = [...rules].sort((a, b) => {
    if (sortField === 'businessUnit') {
      const aName = businessUnits.find(bu => bu.id === a.businessUnit)?.name || '';
      const bName = businessUnits.find(bu => bu.id === b.businessUnit)?.name || '';
      return sortDirection === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    
    if (sortField === 'campaign') {
      const aName = sampleCampaigns.find(c => c.id === a.campaign)?.name || '';
      const bName = sampleCampaigns.find(c => c.id === b.campaign)?.name || '';
      return sortDirection === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    
    if (sortField === 'priority') {
      return sortDirection === 'asc' 
        ? a.priority - b.priority
        : b.priority - a.priority;
    }
    
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('name')}
          >
            Rule Name {getSortIcon('name')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('businessUnit')}
          >
            Business Unit {getSortIcon('businessUnit')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('campaign')}
          >
            Campaign {getSortIcon('campaign')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('priority')}
          >
            Priority {getSortIcon('priority')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('operator')}
          >
            Logic {getSortIcon('operator')}
          </TableHead>
          <TableHead>Conditions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No assignment rules found. Create your first rule to get started.
            </TableCell>
          </TableRow>
        ) : (
          sortedRules.map(rule => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>
                {businessUnits.find(bu => bu.id === rule.businessUnit)?.name}
              </TableCell>
              <TableCell>
                {sampleCampaigns.find(c => c.id === rule.campaign)?.name}
              </TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>
                <Badge variant={rule.operator === 'and' ? 'default' : 'secondary'}>
                  {rule.operator === 'and' ? 'ALL' : 'ANY'}
                </Badge>
              </TableCell>
              <TableCell>{rule.conditions.length} condition(s)</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
