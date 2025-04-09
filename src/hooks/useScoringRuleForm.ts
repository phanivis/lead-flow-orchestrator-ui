
import { useState } from 'react';
import { ScoringRule } from '@/types/scoringTypes';

export const useScoringRuleForm = (
  onSubmit: (rule: Omit<ScoringRule, 'id'>) => boolean,
  initialRule?: ScoringRule | null
) => {
  const [formBusinessUnit, setFormBusinessUnit] = useState<string>(initialRule?.business_unit || '');
  const [description, setDescription] = useState<string>(initialRule?.description || '');
  const [criteria, setCriteria] = useState<string>(initialRule?.criteria || '');
  const [weight, setWeight] = useState<number | undefined>(initialRule?.weight);
  const [isSQL, setIsSQL] = useState<boolean>(initialRule?.isSQL || false);
  
  const resetForm = () => {
    setFormBusinessUnit('');
    setDescription('');
    setCriteria('');
    setWeight(undefined);
    setIsSQL(false);
  };
  
  const handleFormBusinessUnitChange = (value: string) => {
    setFormBusinessUnit(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeight(isNaN(value) ? undefined : value);
  };

  const handleRuleTypeChange = (value: string) => {
    if (value) {
      setIsSQL(value === 'sql');
    }
  };
  
  const handleSubmit = () => {
    const success = onSubmit({
      business_unit: formBusinessUnit,
      description,
      criteria,
      weight: weight!,
      isSQL,
    });
    
    if (success) {
      resetForm();
      return true;
    }
    
    return false;
  };
  
  return {
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
  };
};
