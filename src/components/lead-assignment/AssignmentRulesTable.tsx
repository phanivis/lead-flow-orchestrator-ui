
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { AssignmentRule } from '@/types/assignmentTypes';
import { businessUnits, sampleCampaigns } from '@/data/assignmentData';

interface AssignmentRulesTableProps {
  rules: AssignmentRule[];
  onEdit: (rule: AssignmentRule) => void;
  onDelete: (ruleId: string) => void;
}

export const AssignmentRulesTable = ({ rules, onEdit, onDelete }: AssignmentRulesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rule Name</TableHead>
          <TableHead>Business Unit</TableHead>
          <TableHead>Campaign</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Conditions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No assignment rules found. Create your first rule to get started.
            </TableCell>
          </TableRow>
        ) : (
          rules.map(rule => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>
                {businessUnits.find(bu => bu.id === rule.businessUnit)?.name}
              </TableCell>
              <TableCell>
                {sampleCampaigns.find(c => c.id === rule.campaign)?.name}
              </TableCell>
              <TableCell>{rule.priority}</TableCell>
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
