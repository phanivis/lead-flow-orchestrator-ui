
import React from 'react';
import { LeadIngestionHeader } from '@/components/lead-ingestion/LeadIngestionHeader';
import { QualificationRulesTable } from '@/components/lead-ingestion/QualificationRulesTable';
import { RuleFilterDialog } from '@/components/lead-ingestion/RuleFilterDialog';
import { AlertsConfigModal } from '@/components/lead-ingestion/AlertsConfigModal';
import { RuleBuilderSheet } from '@/components/lead-ingestion/RuleBuilderSheet';
import { useLeadIngestion } from '@/hooks/useLeadIngestion';
import { attributeDefinitions } from '@/data/attributeDefinitions';
import { eventDefinitions } from '@/data/eventDefinitions';

const LeadIngestionPage = () => {
  const {
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
  } = useLeadIngestion();
  
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
      
      <RuleBuilderSheet
        open={isRuleBuilderOpen}
        onOpenChange={setIsRuleBuilderOpen}
        selectedRule={selectedRule}
        selectedAttribute={selectedEvent}
        onSelectAttribute={setSelectedEvent}
        attributes={attributeDefinitions}
        events={eventDefinitions}
        onSaveRule={handleSaveRule}
        onActivateRule={handleActivateRule}
        onConfigureAlerts={() => setShowAlertsModal(true)}
      />
      
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
