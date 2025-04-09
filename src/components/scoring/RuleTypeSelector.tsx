
import React from 'react';
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calculator, Code } from 'lucide-react';

interface RuleTypeSelectorProps {
  isSQL: boolean;
  onRuleTypeChange: (value: string) => void;
}

const RuleTypeSelector: React.FC<RuleTypeSelectorProps> = ({
  isSQL,
  onRuleTypeChange
}) => {
  return (
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
  );
};

export default RuleTypeSelector;
