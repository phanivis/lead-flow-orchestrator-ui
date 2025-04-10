import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeadIngestionHeader } from '@/components/lead-ingestion/LeadIngestionHeader';
import { QualificationRulesTable } from '@/components/lead-ingestion/QualificationRulesTable';
import { RuleFilterDialog } from '@/components/lead-ingestion/RuleFilterDialog';
import { EventList } from '@/components/lead-ingestion/EventList';
import { RuleBuilder } from '@/components/lead-ingestion/RuleBuilder';
import { PreviewPanel } from '@/components/lead-ingestion/PreviewPanel';
import { AlertsConfigModal } from '@/components/lead-ingestion/AlertsConfigModal';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  eventDefinitions, 
  qualificationRules as initialRules, 
  matchingUsers as sampleUsers 
} from '@/data/leadIngestionData';
import { QualificationRule, EventDefinition } from '@/types/leadIngestionTypes';

const LeadIngestionPage = () => {
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
  
  return (
    <div className="space-y-6">
      <LeadIngestionHeader 
        onCreateRule={handleCreateRule}
        onSearch={setSearchQuery}
        onFilter={() => setFilterDialogOpen(true)}
      />
      
      <QualificationRulesTable 
        rules={filteredRules}
        onEdit={handleEditRule}
        onDelete={handleDeleteRule}
        onToggleStatus={handleToggleStatus}
      />
      
      <RuleFilterDialog 
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />
      
      <Sheet 
        open={isRuleBuilderOpen} 
        onOpenChange={setIsRuleBuilderOpen}
        modal={false}
      >
        <SheetContent className="sm:max-w-none w-full p-0 overflow-hidden flex flex-col h-screen bg-background">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              {selectedRule ? `Edit Rule: ${selectedRule.name}` : 'Create Lead Qualification Rule'}
            </h2>
          </div>
          <div className="flex-1 overflow-hidden grid grid-cols-12 gap-6 p-6">
            <div className="col-span-3">
              <EventList 
                events={eventDefinitions}
                onSelectEvent={(event) => setSelectedEvent(event)}
                selectedEventId={selectedEvent?.id}
              />
            </div>
            <div className="col-span-5">
              <RuleBuilder 
                events={eventDefinitions}
                initialConditions={selectedRule?.conditions}
                onSave={handleSaveRule}
              />
            </div>
            <div className="col-span-4">
              <PreviewPanel 
                matchingUsers={sampleUsers}
                onActivate={handleActivateRule}
                onViewAllUsers={() => {
                  toast({
                    title: "View all users",
                    description: "This would open the Lead Explorer with this rule's filter applied.",
                  });
                }}
                onConfigureAlerts={() => setShowAlertsModal(true)}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <AlertsConfigModal 
        open={showAlertsModal}
        onOpenChange={setShowAlertsModal}
        initialAlerts={selectedRule?.alerts}
        onSaveAlerts={handleSaveAlerts}
      />
    </div>
  );
};

export default LeadIngestionPage;
