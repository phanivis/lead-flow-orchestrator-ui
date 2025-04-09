
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { ScoringRule, BusinessUnit } from '@/types/scoringTypes';
import ScoringRuleFormFields from './ScoringRuleFormFields';

interface ScoringRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessUnits: BusinessUnit[];
  editingRule: ScoringRule | null;
  formBusinessUnit: string;
  description: string;
  criteria: string;
  weight: number | undefined;
  isSQL: boolean;
  onBusinessUnitChange: (value: string) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCriteriaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRuleTypeChange: (value: string) => void;
  onSubmit: () => void;
}

export const ScoringRuleFormDialog: React.FC<ScoringRuleFormDialogProps> = ({
  open,
  onOpenChange,
  businessUnits,
  editingRule,
  formBusinessUnit,
  description,
  criteria,
  weight,
  isSQL,
  onBusinessUnitChange,
  onDescriptionChange,
  onCriteriaChange,
  onWeightChange,
  onRuleTypeChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingRule ? 'Edit Scoring Rule' : 'Create Scoring Rule'}</DialogTitle>
          <DialogDescription>
            {editingRule 
              ? 'Modify the scoring rule details.' 
              : 'Set up rules to score leads based on specific criteria.'}
          </DialogDescription>
        </DialogHeader>
        
        <ScoringRuleFormFields 
          businessUnits={businessUnits}
          formBusinessUnit={formBusinessUnit}
          description={description}
          criteria={criteria}
          weight={weight}
          isSQL={isSQL}
          onBusinessUnitChange={onBusinessUnitChange}
          onDescriptionChange={onDescriptionChange}
          onCriteriaChange={onCriteriaChange}
          onWeightChange={onWeightChange}
          onRuleTypeChange={onRuleTypeChange}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoringRuleFormDialog;
