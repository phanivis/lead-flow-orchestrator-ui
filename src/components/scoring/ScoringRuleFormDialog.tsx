
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Code, Calculator, Save } from 'lucide-react';

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
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="business-unit" className="flex items-center">
                Business Unit <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formBusinessUnit}
                onValueChange={onBusinessUnitChange}
              >
                <SelectTrigger id="business-unit">
                  <SelectValue placeholder="Select a business unit" />
                </SelectTrigger>
                <SelectContent>
                  {businessUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this rule"
                value={description}
                onChange={onDescriptionChange}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="rule-type" className="mb-2 block">
                Rule Type
              </Label>
              <ToggleGroup
                type="single"
                value={isSQL ? 'sql' : 'builder'}
                onValueChange={onRuleTypeChange}
                className="justify-start"
              >
                <ToggleGroupItem value="builder">
                  <Calculator className="h-4 w-4 mr-2" />
                  Builder
                </ToggleGroupItem>
                <ToggleGroupItem value="sql">
                  <Code className="h-4 w-4 mr-2" />
                  SQL
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <Label htmlFor="criteria" className="flex items-center">
                Criteria <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="criteria"
                placeholder={isSQL ? "Enter SQL expression" : "Enter criteria"}
                value={criteria}
                onChange={onCriteriaChange}
              />
            </div>
            
            <div>
              <Label htmlFor="weight" className="flex items-center">
                Weight (1-100) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                min={1}
                max={100}
                value={weight !== undefined ? weight.toString() : ''}
                onChange={onWeightChange}
              />
            </div>
          </div>
        </div>
        
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
