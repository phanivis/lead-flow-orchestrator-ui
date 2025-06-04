
import { useState, useEffect } from 'react';
import { QualificationRule } from '@/types/leadIngestionTypes';

export const useRuleFiltering = (rules: QualificationRule[]) => {
  const [filteredRules, setFilteredRules] = useState<QualificationRule[]>(rules);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: { active: false, paused: false },
    updatedBy: '',
    tags: []
  });

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

  return {
    filteredRules,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters
  };
};
