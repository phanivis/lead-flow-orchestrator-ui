
import { useToast } from '@/hooks/use-toast';
import { QualificationRule, AlertConfig } from '@/types/leadIngestionTypes';

export const useRuleOperations = (
  rules: QualificationRule[],
  setRules: React.Dispatch<React.SetStateAction<QualificationRule[]>>
) => {
  const { toast } = useToast();

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
        rule.id === ruleId ? { 
          ...rule, 
          status: newStatus,
          lastUpdatedBy: 'current.user@acko.com',
          updatedAt: new Date().toISOString()
        } : rule
      )
    );
    toast({
      title: `Rule ${newStatus === 'active' ? 'activated' : 'paused'}`,
      description: `The qualification rule is now ${newStatus}.`,
    });
  };

  const handleSaveRule = (ruleData: any, selectedRule: QualificationRule | null) => {
    const now = new Date().toISOString();
    
    if (selectedRule) {
      const updatedRule: QualificationRule = {
        ...selectedRule,
        name: ruleData.name,
        description: ruleData.description,
        journey: ruleData.journey || selectedRule.journey,
        conditions: ruleData.conditions || [],
        conditionGroups: ruleData.conditionGroups || [],
        rootOperator: ruleData.rootOperator || 'AND',
        updatedAt: now,
        lastUpdatedBy: 'current.user@acko.com',
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
        journey: ruleData.journey || 'Car-Fresh',
        status: 'draft',
        conditions: ruleData.conditions || [],
        conditionGroups: ruleData.conditionGroups || [],
        rootOperator: ruleData.rootOperator || 'AND',
        createdBy: 'current.user@acko.com',
        createdAt: now,
        updatedAt: now,
        lastUpdatedBy: 'current.user@acko.com',
        matchCount: 0,
        version: 1,
        tags: []
      };
      
      setRules(prev => [...prev, newRule]);
      
      toast({
        title: "Rule created",
        description: `"${ruleData.name}" has been created as a draft.`,
      });
    }
  };

  const handleActivateRule = (selectedRule: QualificationRule | null) => {
    if (!selectedRule) return;
    
    setRules(prev => 
      prev.map(rule => 
        rule.id === selectedRule.id ? { 
          ...rule, 
          status: 'active',
          lastUpdatedBy: 'current.user@acko.com',
          updatedAt: new Date().toISOString()
        } : rule
      )
    );
    
    toast({
      title: "Rule activated",
      description: `"${selectedRule.name}" is now active and qualifying leads.`,
      variant: "default"
    });
  };

  const createSaveAlertsHandler = (selectedRule: QualificationRule | null) => {
    return (alerts: AlertConfig[]) => {
      if (!selectedRule) return;
      
      setRules(prev => 
        prev.map(rule => 
          rule.id === selectedRule.id ? { 
            ...rule, 
            alerts,
            lastUpdatedBy: 'current.user@acko.com',
            updatedAt: new Date().toISOString()
          } : rule
        )
      );
      
      toast({
        title: "Alerts configured",
        description: `Alerts for "${selectedRule.name}" have been updated.`,
      });
    };
  };

  return {
    handleDeleteRule,
    handleToggleStatus,
    handleSaveRule,
    handleActivateRule,
    createSaveAlertsHandler
  };
};
