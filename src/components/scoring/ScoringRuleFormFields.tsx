
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessUnit } from '@/types/scoringTypes';
import RuleTypeSelector from './RuleTypeSelector';
import SqlExamplesHint from './SqlExamplesHint';

interface ScoringRuleFormFieldsProps {
  businessUnits: BusinessUnit[];
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
}

const ScoringRuleFormFields: React.FC<ScoringRuleFormFieldsProps> = ({
  businessUnits,
  formBusinessUnit,
  description,
  criteria,
  weight,
  isSQL,
  onBusinessUnitChange,
  onDescriptionChange,
  onCriteriaChange,
  onWeightChange,
  onRuleTypeChange
}) => {
  return (
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
        
        <RuleTypeSelector isSQL={isSQL} onRuleTypeChange={onRuleTypeChange} />
        
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
        
        {isSQL && <SqlExamplesHint />}
        
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
  );
};

export default ScoringRuleFormFields;
