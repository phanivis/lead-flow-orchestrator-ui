
import React, { useState } from 'react';
import { ScoringPageHeader } from '@/components/scoring/ScoringPageHeader';
import { ScoringRulesContainer } from '@/components/scoring/ScoringRulesContainer';
import { ScoringRuleFormDialog } from '@/components/scoring/ScoringRuleFormDialog';
import { useScoringRules } from '@/hooks/useScoringRules';
import { useScoringRuleForm } from '@/hooks/useScoringRuleForm';
import { ScoringRule } from '@/types/scoringTypes';

const ScoringRulesPage: React.FC = () => {
  const {
    businessUnits,
    filteredRules,
    selectedBusinessUnit,
    handleBusinessUnitChange,
    addScoringRule,
    updateScoringRule,
    deleteScoringRule
  } = useScoringRules();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<ScoringRule | null>(null);

  // Initialize form handlers with appropriate submission function
  const handleSubmitRule = (rule: Omit<ScoringRule, 'id'>) => {
    let success = false;
    
    if (editingRule) {
      success = updateScoringRule(editingRule.id, rule);
    } else {
      success = addScoringRule(rule);
    }
    
    if (success) {
      setIsDialogOpen(false);
      return true;
    }
    
    return false;
  };
  
  const {
    formBusinessUnit,
    description,
    criteria,
    weight,
    isSQL,
    handleFormBusinessUnitChange,
    handleDescriptionChange,
    handleCriteriaChange,
    handleWeightChange,
    handleRuleTypeChange,
    handleSubmit,
    resetForm
  } = useScoringRuleForm(handleSubmitRule, editingRule);
  
  const openAddDialog = () => {
    setEditingRule(null);
    resetForm();
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (rule: ScoringRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ScoringPageHeader
        selectedBusinessUnit={selectedBusinessUnit}
        businessUnits={businessUnits}
        onBusinessUnitChange={handleBusinessUnitChange}
        onAddRule={openAddDialog}
      />

      <ScoringRulesContainer
        rules={filteredRules}
        businessUnits={businessUnits}
        onEdit={openEditDialog}
        onDelete={deleteScoringRule}
      />
      
      <ScoringRuleFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        businessUnits={businessUnits}
        editingRule={editingRule}
        formBusinessUnit={formBusinessUnit}
        description={description}
        criteria={criteria}
        weight={weight}
        isSQL={isSQL}
        onBusinessUnitChange={handleFormBusinessUnitChange}
        onDescriptionChange={handleDescriptionChange}
        onCriteriaChange={handleCriteriaChange}
        onWeightChange={handleWeightChange}
        onRuleTypeChange={handleRuleTypeChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ScoringRulesPage;
