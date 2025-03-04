
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Case as CaseType, 
  getCases, 
  createCase, 
  getCase, 
  updateCaseDetails, 
  updateCaseStatus, 
  updateCasePriority, 
  updateCaseDeadline, 
  updateCaseNotes 
} from '@/utils/documents';

export const useCaseManagement = () => {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [isCreateCaseDialogOpen, setIsCreateCaseDialogOpen] = useState(false);
  const [isEditCaseDialogOpen, setIsEditCaseDialogOpen] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editCaseName, setEditCaseName] = useState('');
  const [editCaseStatus, setEditCaseStatus] = useState<'active' | 'pending' | 'closed'>('active');
  const [editCasePriority, setEditCasePriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [editCaseDeadline, setEditCaseDeadline] = useState<Date | undefined>(undefined);
  const [editCaseDescription, setEditCaseDescription] = useState('');

  useEffect(() => {
    const loadCases = () => {
      try {
        const storedCases = getCases();
        setCases(storedCases);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cases:', error);
        setIsLoading(false);
      }
    };
    
    loadCases();
  }, []);

  const handleCreateCase = () => {
    if (!newCaseName.trim()) {
      toast.error('Please enter a case name');
      return;
    }
    
    try {
      const newCase = createCase(newCaseName);
      setCases([...cases, newCase]);
      setNewCaseName('');
      setIsCreateCaseDialogOpen(false);
      toast.success('Case created successfully');
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
    }
  };

  const handleEditCase = (e: React.MouseEvent, caseId: string) => {
    e.stopPropagation();
    const caseToEdit = getCase(caseId);
    if (caseToEdit) {
      setEditingCaseId(caseId);
      setEditCaseName(caseToEdit.name);
      setEditCaseStatus(caseToEdit.status || 'active');
      setEditCasePriority(caseToEdit.priority || 'medium');
      setEditCaseDeadline(caseToEdit.deadline ? new Date(caseToEdit.deadline) : undefined);
      setEditCaseDescription(caseToEdit.notes || '');
      setIsEditCaseDialogOpen(true);
    }
  };

  const handleSaveEditCase = () => {
    if (!editingCaseId) return;
    
    try {
      console.log("Updating case with values:", {
        name: editCaseName,
        status: editCaseStatus,
        priority: editCasePriority,
        deadline: editCaseDeadline ? editCaseDeadline.getTime() : undefined,
        notes: editCaseDescription
      });

      const updatedCase = updateCaseDetails(editingCaseId, {
        name: editCaseName,
        status: editCaseStatus,
        priority: editCasePriority,
        deadline: editCaseDeadline ? editCaseDeadline.getTime() : undefined,
        notes: editCaseDescription
      });
      
      if (updatedCase) {
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === editingCaseId ? updatedCase : c
          )
        );
        setIsEditCaseDialogOpen(false);
        toast.success('Case updated successfully');
      }
    } catch (error) {
      console.error('Error updating case:', error);
      toast.error('Failed to update case');
    }
  };

  const handleUpdateStatus = (caseId: string, newStatus: 'active' | 'pending' | 'closed') => {
    try {
      const updatedCase = updateCaseStatus(caseId, newStatus);
      if (updatedCase) {
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === caseId ? updatedCase : c
          )
        );
      }
    } catch (error) {
      console.error('Error updating case status:', error);
      toast.error('Failed to update case status');
    }
  };

  const handleUpdatePriority = (caseId: string, newPriority: 'high' | 'medium' | 'low') => {
    try {
      const updatedCase = updateCasePriority(caseId, newPriority);
      if (updatedCase) {
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === caseId ? updatedCase : c
          )
        );
      }
    } catch (error) {
      console.error('Error updating case priority:', error);
      toast.error('Failed to update case priority');
    }
  };

  const handleUpdateDeadline = (caseId: string, newDeadline: Date | undefined) => {
    try {
      const deadlineTimestamp = newDeadline ? newDeadline.getTime() : undefined;
      const updatedCase = updateCaseDeadline(caseId, deadlineTimestamp);
      if (updatedCase) {
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === caseId ? updatedCase : c
          )
        );
      }
    } catch (error) {
      console.error('Error updating case deadline:', error);
      toast.error('Failed to update case deadline');
    }
  };

  const handleUpdateNotes = (caseId: string, newNotes: string) => {
    try {
      const updatedCase = updateCaseNotes(caseId, newNotes);
      if (updatedCase) {
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === caseId ? updatedCase : c
          )
        );
      }
    } catch (error) {
      console.error('Error updating case notes:', error);
      toast.error('Failed to update case notes');
    }
  };
  
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
    cases,
    filteredCases,
    isLoading,
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    newCaseName,
    setNewCaseName,
    isCreateCaseDialogOpen,
    setIsCreateCaseDialogOpen,
    isEditCaseDialogOpen,
    setIsEditCaseDialogOpen,
    editCaseName,
    setEditCaseName,
    editCaseStatus,
    setEditCaseStatus,
    editCasePriority,
    setEditCasePriority,
    editCaseDeadline,
    setEditCaseDeadline,
    editCaseDescription,
    setEditCaseDescription,
    handleCreateCase,
    handleEditCase,
    handleSaveEditCase,
    handleUpdateStatus,
    handleUpdatePriority,
    handleUpdateDeadline,
    handleUpdateNotes,
    resetFilters
  };
};
