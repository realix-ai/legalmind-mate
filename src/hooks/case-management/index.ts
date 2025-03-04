
import { useEffect } from 'react';
import { useCaseCrud } from './useCaseCrud';
import { useCaseFilters } from './useCaseFilters';
import { useCaseDialog } from './useCaseDialog';

export const useCaseManagement = () => {
  const {
    cases,
    isLoading,
    loadCases,
    handleCreateCase,
    handleUpdateCase,
    handleUpdateStatus,
    handleUpdatePriority,
    handleUpdateDeadline,
    handleUpdateNotes
  } = useCaseCrud();

  const {
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
  } = useCaseFilters(cases);

  const {
    newCaseName,
    setNewCaseName,
    isCreateCaseDialogOpen,
    setIsCreateCaseDialogOpen,
    resetCreateCaseForm,
    isEditCaseDialogOpen,
    setIsEditCaseDialogOpen,
    editingCaseId,
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
    handleEditCase,
    resetEditCaseForm
  } = useCaseDialog();

  useEffect(() => {
    loadCases();
  }, []);

  const createCaseAndReset = () => {
    const result = handleCreateCase(newCaseName);
    if (result) {
      resetCreateCaseForm();
    }
  };

  const saveEditCaseAndReset = () => {
    if (!editingCaseId) return;
    
    const result = handleUpdateCase(editingCaseId, {
      name: editCaseName,
      status: editCaseStatus,
      priority: editCasePriority,
      deadline: editCaseDeadline ? editCaseDeadline.getTime() : undefined,
      notes: editCaseDescription
    });

    if (result) {
      resetEditCaseForm();
    }
  };

  return {
    // Case data
    cases,
    filteredCases,
    isLoading,
    
    // Filters
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    resetFilters,
    
    // Create case dialog
    newCaseName,
    setNewCaseName,
    isCreateCaseDialogOpen,
    setIsCreateCaseDialogOpen,
    
    // Edit case dialog
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
    
    // Actions
    handleCreateCase: createCaseAndReset,
    handleEditCase,
    handleSaveEditCase: saveEditCaseAndReset,
    handleUpdateStatus,
    handleUpdatePriority,
    handleUpdateDeadline,
    handleUpdateNotes
  };
};

export * from './useCaseCrud';
export * from './useCaseFilters';
export * from './useCaseDialog';
