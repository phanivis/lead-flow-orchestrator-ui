
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
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

type ScoringRule = {
  id: string;
  business_unit: string;
  criteria: string;
  weight: number;
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
  const getBusinessUnitName = (id: string) => {
    return businessUnits.find(bu => bu.id === id)?.name || id;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Unit</TableHead>
          <TableHead>Criteria</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
              No scoring rules found. Create your first rule to get started.
            </TableCell>
          </TableRow>
        ) : (
          rules.map(rule => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{getBusinessUnitName(rule.business_unit)}</TableCell>
              <TableCell>{rule.criteria}</TableCell>
              <TableCell>{rule.weight}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
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
          ))
        )}
      </TableBody>
    </Table>
  );
};
