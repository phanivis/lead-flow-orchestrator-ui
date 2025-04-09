
import React, { useState } from 'react';
import { toast } from 'sonner';
import { LeadFilters } from '@/components/lead-explorer/LeadFilters';
import { LeadTable } from '@/components/lead-explorer/LeadTable';
import { LeadAttributeDialog } from '@/components/lead-explorer/LeadAttributeDialog';
import { AssignLeadDialog } from '@/components/lead-explorer/AssignLeadDialog';
import { dummyLeads, Lead } from '@/data/dummyLeads';

const LeadExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleRefreshData = () => {
    toast.success('Lead data refreshed successfully');
    setTimeout(() => {
      setLeads([...dummyLeads].sort(() => Math.random() - 0.5));
    }, 300);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefreshData={handleRefreshData}
        onOpenAttributeDialog={() => setIsAttributeDialogOpen(true)}
      />

      <LeadTable
        leads={leads}
        filteredLeads={filteredLeads}
        selectedLeads={selectedLeads}
        onSelectAll={handleSelectAll}
        onSelectLead={handleSelectLead}
        onOpenAssignDialog={() => setIsAssignDialogOpen(true)}
      />

      <LeadAttributeDialog 
        open={isAttributeDialogOpen} 
        onOpenChange={setIsAttributeDialogOpen} 
      />

      <AssignLeadDialog 
        open={isAssignDialogOpen} 
        onOpenChange={setIsAssignDialogOpen} 
        selectedLeadCount={selectedLeads.length}
      />
    </div>
  );
};

export default LeadExplorerPage;
