
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  QualificationRule, 
  EventDefinition, 
  RuleCondition 
} from '@/types/leadIngestionTypes';
import { 
  eventDefinitions, 
  qualificationRules as initialRules, 
  matchingUsers as sampleUsers 
} from '@/data/leadIngestionData';

export const useLeadIngestion = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<QualificationRule[]>(initialRules);
  const [filteredRules, setFilteredRules] = useState<QualificationRule[]>(initialRules);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: { active: false, paused: false },
    updatedBy: '',
    tags: []
  });
  
  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<QualificationRule | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDefinition | null>(null);
  
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  
  useEffect(() => {
    let result = [...rules];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(rule => 
        rule.name.toLowerCase().includes(query) || 
        (rule.description && rule.description.toLowerCase().includes(query)) ||
        rule.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (filters.status.active && !filters.status.paused) {
      result = result.filter(rule => rule.status === 'active');
    } else if (!filters.status.active && filters.status.paused) {
      result = result.filter(rule => rule.status === 'paused');
    }
    
    if (filters.updatedBy) {
      result = result.filter(rule => 
        rule.createdBy.toLowerCase().includes(filters.updatedBy.toLowerCase())
      );
    }
    
    if (filters.tags.length > 0) {
      result = result.filter(rule => 
        filters.tags.some(tag => rule.tags.includes(tag))
      );
    }
    
    setFilteredRules(result);
  }, [rules, searchQuery, filters]);
  
  const handleCreateRule = () => {
    setSelectedRule(null);
    setIsRuleBuilderOpen(true);
  };
  
  const handleEditRule = (rule: QualificationRule) => {
    setSelectedRule(rule);
    setIsRuleBuilderOpen(true);
  };
  
  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: "Rule deleted",
      description: "The qualification rule has been deleted.",
    });
  };
  
  const handleToggleStatus = (ruleId: string, newStatus: 'active' | 'paused') => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, status: newStatus } : rule
      )
    );
    toast({
      title: `Rule ${newStatus === 'active' ? 'activated' : 'paused'}`,
      description: `The qualification rule is now ${newStatus}.`,
    });
  };
  
  const handleSaveRule = (ruleData: any) => {
    const now = new Date().toISOString();
    
    if (selectedRule) {
      const updatedRule: QualificationRule = {
        ...selectedRule,
        name: ruleData.name,
        description: ruleData.description,
        tags: ruleData.tags,
        conditions: ruleData.conditions,
        updatedAt: now,
        version: selectedRule.version + 1
      };
      
      setRules(prev => 
        prev.map(rule => rule.id === selectedRule.id ? updatedRule : rule)
      );
      
      toast({
        title: "Rule updated",
        description: `"${ruleData.name}" has been updated.`,
      });
    } else {
      const newRule: QualificationRule = {
        id: `rule-${Date.now()}`,
        name: ruleData.name,
        description: ruleData.description,
        status: 'draft',
        tags: ruleData.tags,
        conditions: ruleData.conditions,
        conditionGroups: [],
        rootOperator: 'AND',
        createdBy: 'current.user@acko.com',
        createdAt: now,
        updatedAt: now,
        matchCount: 0,
        version: 1
      };
      
      setRules(prev => [...prev, newRule]);
      
      toast({
        title: "Rule created",
        description: `"${ruleData.name}" has been created as a draft.`,
      });
    }
    
    setIsRuleBuilderOpen(false);
  };
  
  const handleActivateRule = () => {
    if (!selectedRule) return;
    
    setRules(prev => 
      prev.map(rule => 
        rule.id === selectedRule.id ? { ...rule, status: 'active' } : rule
      )
    );
    
    setIsRuleBuilderOpen(false);
    
    toast({
      title: "Rule activated",
      description: `"${selectedRule.name}" is now active and qualifying leads.`,
      variant: "default"
    });
  };
  
  const handleSaveAlerts = (alerts: any) => {
    if (!selectedRule) return;
    
    setRules(prev => 
      prev.map(rule => 
        rule.id === selectedRule.id ? { ...rule, alerts } : rule
      )
    );
    
    toast({
      title: "Alerts configured",
      description: `Alerts for "${selectedRule.name}" have been updated.`,
    });
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
    handleSaveAlerts,
    sampleUsers
  };
};
