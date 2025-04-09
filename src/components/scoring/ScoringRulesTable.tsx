import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Code, Calculator } from 'lucide-react';
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
  const getBusinessUnitName = (id: string) => {
    return businessUnits.find(bu => bu.id === id)?.name || id;
  };

  const dummyRules = [
    {
      id: "dummy-1",
      business_unit: "motor",
      description: "High-value car insurance leads",
      criteria: "vehicle_value > 1500000 AND age BETWEEN 25 AND 45",
      weight: 85,
      isSQL: true
    },
    {
      id: "dummy-2",
      business_unit: "health",
      description: "Family health plan prospects",
      criteria: "family_members >= 4 AND income_bracket = 'High'",
      weight: 75,
      isSQL: true
    },
    {
      id: "dummy-3",
      business_unit: "life",
      description: "Term life insurance for young adults",
      criteria: "age < 35 AND employment_status = 'Employed'",
      weight: 80,
      isSQL: false
    }
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Unit</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Criteria</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.length === 0 ? (
          <>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Here are some sample scoring rules to get you started. Click "Add Rule" to create your own.
              </TableCell>
            </TableRow>
            {dummyRules.map(rule => (
              <TableRow key={rule.id} className="opacity-60">
                <TableCell className="font-medium">{getBusinessUnitName(rule.business_unit)}</TableCell>
                <TableCell>{rule.description || "—"}</TableCell>
                <TableCell>{rule.criteria}</TableCell>
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
                    <Button variant="ghost" size="icon" disabled>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          rules.map(rule => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{getBusinessUnitName(rule.business_unit)}</TableCell>
              <TableCell>{rule.description || "—"}</TableCell>
              <TableCell>{rule.criteria}</TableCell>
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
