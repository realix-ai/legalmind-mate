
import { useState } from 'react';
import { Case as CaseType } from '@/utils/documents';

export const useCaseFilters = (cases: CaseType[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = caseItem.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || 
      (caseItem.status && statusFilter.includes(caseItem.status));
    
    const matchesPriority = priorityFilter.length === 0 || 
      (caseItem.priority && priorityFilter.includes(caseItem.priority));
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const resetFilters = () => {
    setStatusFilter([]);
    setPriorityFilter([]);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isFilterOpen,
    setIsFilterOpen,
    filteredCases,
    resetFilters
  };
};
