
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { LeadFilters } from '@/components/lead-explorer/LeadFilters';
import { LeadTable } from '@/components/lead-explorer/LeadTable';
import { LeadAttributeDialog } from '@/components/lead-explorer/LeadAttributeDialog';
import { AssignLeadDialog } from '@/components/lead-explorer/AssignLeadDialog';
import { FilterDialog, Filters } from '@/components/lead-explorer/FilterDialog';
import { dummyLeads, Lead } from '@/data/dummyLeads';

const LeadExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    city: [],
    existingPolicyHolder: ''
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
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

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search term filter
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(lead.status);
      
      // City filter
      const matchesCity = filters.city.length === 0 || filters.city.includes(lead.city);
      
      // Policy holder filter
      const matchesPolicyHolder = !filters.existingPolicyHolder || 
        filters.existingPolicyHolder === "any" || 
        lead.existingPolicyHolder === filters.existingPolicyHolder;
      
      return matchesSearch && matchesStatus && matchesCity && matchesPolicyHolder;
    });
  }, [leads, searchTerm, filters]);

  return (
    <div className="space-y-6">
      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefreshData={handleRefreshData}
        onOpenAttributeDialog={() => setIsAttributeDialogOpen(true)}
        onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
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

      <FilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default LeadExplorerPage;
