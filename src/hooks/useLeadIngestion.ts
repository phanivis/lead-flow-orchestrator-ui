
import { useState } from 'react';
import { 
  QualificationRule, 
  EventDefinition 
} from '@/types/leadIngestionTypes';
import { 
  eventDefinitions, 
  qualificationRules as initialRules, 
  matchingUsers as sampleUsers 
} from '@/data/leadIngestionData';
import { useRuleOperations } from './useRuleOperations';
import { useRuleFiltering } from './useRuleFiltering';

export const useLeadIngestion = () => {
  const [rules, setRules] = useState<QualificationRule[]>(initialRules);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<QualificationRule | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDefinition | null>(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  
  const {
    filteredRules,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters
  } = useRuleFiltering(rules);
  
  const {
    handleDeleteRule,
    handleToggleStatus,
    handleSaveRule: saveRule,
    handleActivateRule: activateRule,
    createSaveAlertsHandler
  } = useRuleOperations(rules, setRules);
  
  const handleCreateRule = () => {
    setSelectedRule(null);
    setIsRuleBuilderOpen(true);
  };
  
  const handleEditRule = (rule: QualificationRule) => {
    setSelectedRule(rule);
    setIsRuleBuilderOpen(true);
  };
  
  const handleSaveRule = (ruleData: any) => {
    saveRule(ruleData, selectedRule);
    setIsRuleBuilderOpen(false);
  };
  
  const handleActivateRule = () => {
    activateRule(selectedRule);
    setIsRuleBuilderOpen(false);
  };

  return {
    rules,
    filteredRules,
    searchQuery,
    setSearchQuery,
    filterDialogOpen,
    setFilterDialogOpen,
    filters,
    setFilters,
    isRuleBuilderOpen,
    setIsRuleBuilderOpen,
    selectedRule,
    selectedEvent,
    setSelectedEvent,
    showAlertsModal,
    setShowAlertsModal,
    handleCreateRule,
    handleEditRule,
    handleDeleteRule,
    handleToggleStatus,
    handleSaveRule,
    handleActivateRule,
    createSaveAlertsHandler,
    sampleUsers
  };
};
