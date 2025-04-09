
import React, { useState } from 'react';
import { ScoringPageHeader } from '@/components/scoring/ScoringPageHeader';
import { ScoringRulesContainer } from '@/components/scoring/ScoringRulesContainer';
import { ScoringRuleFormDialog } from '@/components/scoring/ScoringRuleFormDialog';
import { useScoringRules } from '@/hooks/useScoringRules';
import { useScoringRuleForm } from '@/hooks/useScoringRuleForm';
import { ScoringRule } from '@/types/scoringTypes';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { ScoringRuleDetailsTable } from '@/components/scoring/ScoringRuleDetailsTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  
  // New state for rule details view
  const [showRuleDetails, setShowRuleDetails] = useState<boolean>(false);
  const [currentRule, setCurrentRule] = useState<ScoringRule | null>(null);
  
  // Sample rule details data
  const ruleDetails = [
    {
      id: '1',
      name: 'Page visitor',
      description: 'User visited the page multiple times',
      score: 25,
      version: '1.0',
    },
    {
      id: '2',
      name: 'Requested Quote',
      description: 'User requested a price quote',
      score: 75,
      version: '2.1',
    },
    {
      id: '3',
      name: 'Interacted with BU page',
      description: 'User spent time on business unit page',
      score: 50,
      version: '1.5',
    }
  ];

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
    setCurrentRule(rule);
    setShowRuleDetails(true);
  };
  
  const handleEditRuleDetail = (detail: any) => {
    // Logic to edit rule detail would go here
    console.log('Edit rule detail:', detail);
  };
  
  const handleDeleteRuleDetail = (detailId: string) => {
    // Logic to delete rule detail would go here
    console.log('Delete rule detail:', detailId);
  };
  
  const handleCloseRuleDetails = () => {
    setShowRuleDetails(false);
    setCurrentRule(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {!showRuleDetails ? (
        // Main scoring rules view
        <>
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
        </>
      ) : (
        // Rule details view
        <>
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCloseRuleDetails}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              Rule Details: {currentRule?.description || 'Loading...'}
            </h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <ScoringRuleDetailsTable 
              details={ruleDetails}
              onEdit={handleEditRuleDetail}
              onDelete={handleDeleteRuleDetail}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ScoringRulesPage;
