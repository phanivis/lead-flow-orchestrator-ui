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
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    city: [],
    existingPolicyHolder: '',
    businessUnit: [],
    leadScoreRange: [0, 100],
    tags: [],
    source: [],
    updateDateRange: { from: undefined, to: undefined }
  });

  const handleRefreshData = () => {
    toast.success('Lead data refreshed successfully');
    setTimeout(() => {
      setLeads([...dummyLeads].sort(() => Math.random() - 0.5));
    }, 300);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true);
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
      
      // Business Unit filter (using a default property if it doesn't exist yet)
      const businessUnit = lead.businessUnit || '';
      const matchesBusinessUnit = filters.businessUnit.length === 0 || 
        filters.businessUnit.includes(businessUnit);
      
      // Lead score filter
      const leadScore = lead.leadScore || 0;
      const matchesLeadScore = leadScore >= filters.leadScoreRange[0] && 
        leadScore <= filters.leadScoreRange[1];
      
      // Tags filter (using a default property if it doesn't exist yet)
      const tags = lead.tags || [];
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some(tag => tags.includes(tag));
      
      // Source filter (using a default property if it doesn't exist yet)
      const source = lead.source || '';
      const matchesSource = filters.source.length === 0 || 
        filters.source.includes(source);
      
      // Date range filter (using updatedAt property if it exists)
      let matchesDateRange = true;
      if (filters.updateDateRange.from || filters.updateDateRange.to) {
        const updatedAt = lead.updatedAt ? new Date(lead.updatedAt) : new Date();
        
        if (filters.updateDateRange.from && filters.updateDateRange.to) {
          matchesDateRange = updatedAt >= filters.updateDateRange.from && 
            updatedAt <= filters.updateDateRange.to;
        } else if (filters.updateDateRange.from) {
          matchesDateRange = updatedAt >= filters.updateDateRange.from;
        } else if (filters.updateDateRange.to) {
          matchesDateRange = updatedAt <= filters.updateDateRange.to;
        }
      }
      
      return matchesSearch && matchesStatus && matchesCity && 
        matchesPolicyHolder && matchesBusinessUnit && 
        matchesLeadScore && matchesTags && matchesSource && matchesDateRange;
    });
  }, [leads, searchTerm, filters]);

  return (
    <div className="space-y-6">
      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefreshData={handleRefreshData}
        onOpenAttributeDialog={() => setIsAttributeDialogOpen(true)}
        onOpenFilterDialog={openFilterDialog}
      />

      <LeadTable
        leads={leads}
        filteredLeads={filteredLeads}
        onOpenAssignDialog={() => setIsAssignDialogOpen(true)}
        onOpenFilterDialog={openFilterDialog}
      />

      <LeadAttributeDialog 
        open={isAttributeDialogOpen} 
        onOpenChange={setIsAttributeDialogOpen} 
      />

      <AssignLeadDialog 
        open={isAssignDialogOpen} 
        onOpenChange={setIsAssignDialogOpen} 
        selectedLeadCount={0}
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
