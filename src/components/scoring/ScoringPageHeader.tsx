
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { BusinessUnitSelector } from '@/components/scoring/BusinessUnitSelector';
import { BusinessUnit } from '@/types/scoringTypes';

interface ScoringPageHeaderProps {
  selectedBusinessUnit: string;
  businessUnits: BusinessUnit[];
  onBusinessUnitChange: (value: string) => void;
  onAddRule: () => void;
}

export const ScoringPageHeader: React.FC<ScoringPageHeaderProps> = ({
  selectedBusinessUnit,
  businessUnits,
  onBusinessUnitChange,
  onAddRule
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Scoring Rules</h1>
      <div className="flex items-center gap-2">
        <BusinessUnitSelector 
          selectedBusinessUnit={selectedBusinessUnit}
          businessUnits={businessUnits}
          onBusinessUnitChange={onBusinessUnitChange}
        />
        <Button onClick={onAddRule}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>
    </div>
  );
};
