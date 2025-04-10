
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
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
import { ScoringRule, BusinessUnit } from '@/types/scoringTypes';

interface ScoringTableRowProps {
  rule: ScoringRule;
  businessUnits: BusinessUnit[];
  onEdit: (rule: ScoringRule) => void;
  onDelete: (ruleId: string) => void;
}

export const ScoringTableRow: React.FC<ScoringTableRowProps> = ({
  rule,
  businessUnits,
  onEdit,
  onDelete,
}) => {
  const getBusinessUnitName = (id: string) => {
    // For motor insurance, check if it's car or bike based on the description
    if (id === 'motor') {
      const lowerDesc = rule.description?.toLowerCase() || '';
      if (lowerDesc.includes('car')) {
        return 'Car Insurance';
      } else if (lowerDesc.includes('bike')) {
        return 'Bike Insurance';
      } else {
        return 'Motor Insurance'; // fallback
      }
    }
    
    return businessUnits.find(bu => bu.id === id)?.name || id;
  };

  return (
    <TableRow key={rule.id}>
      <TableCell className="font-medium">{getBusinessUnitName(rule.business_unit)}</TableCell>
      <TableCell>{rule.description || "—"}</TableCell>
      <TableCell>{rule.weight}</TableCell>
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
  );
};
