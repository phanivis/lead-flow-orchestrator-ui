
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoringRulesTable } from '@/components/scoring/ScoringRulesTable';
import { ScoringRule, BusinessUnit } from '@/types/scoringTypes';

interface ScoringRulesContainerProps {
  rules: ScoringRule[];
  businessUnits: BusinessUnit[];
  onEdit: (rule: ScoringRule) => void;
  onDelete: (ruleId: string) => void;
}

export const ScoringRulesContainer: React.FC<ScoringRulesContainerProps> = ({
  rules,
  businessUnits,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring Rules</CardTitle>
        <CardDescription>
          Define rules for scoring leads based on different criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScoringRulesTable
          rules={rules}
          businessUnits={businessUnits}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};
