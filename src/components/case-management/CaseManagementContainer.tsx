
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useEffect } from 'react';
import { useCaseManagement } from '@/hooks/case-management';
import { useCaseFilters } from '@/hooks/case-management';
import { useCaseDialog } from '@/hooks/case-management';
import CaseManagementContent from './CaseManagementContent';
import CreateCaseDialog from './CreateCaseDialog';
import EditCaseDialog from './EditCaseDialog';
import { Dialog } from '@/components/ui/dialog';

const CaseManagementContainer = () => {
  // Get case data and operations from hooks
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
  } = useCaseManagement();
  
  // Get filtering functionality
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
  
  // Get dialog state management
  const {
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
    editClientName,
    setEditClientName,
    editingCaseId,
    handleEditCase,
    resetEditCaseForm
  } = useCaseDialog();

  // Load cases when component mounts
  useEffect(() => {
    loadCases();
  }, [loadCases]);
  
  const handleCreateNewCase = () => {
    if (!newCaseName.trim()) {
      return; // Don't create case if name is empty
    }
    handleCreateCase(newCaseName);
    setNewCaseName('');
    setIsCreateCaseDialogOpen(false);
  };
  
  const handleSaveEditCase = () => {
    if (editingCaseId) {
      handleUpdateCase(editingCaseId, {
        name: editCaseName,
        status: editCaseStatus,
        priority: editCasePriority,
        deadline: editCaseDeadline ? editCaseDeadline.getTime() : undefined,
        notes: editCaseDescription,
        clientName: editClientName
      });
      resetEditCaseForm();
    }
  };

  console.log("Create case dialog state:", isCreateCaseDialogOpen);

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <CaseManagementContent
          cases={cases}
          filteredCases={filteredCases}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          resetFilters={resetFilters}
          setIsCreateCaseDialogOpen={setIsCreateCaseDialogOpen}
          isCreateCaseDialogOpen={isCreateCaseDialogOpen}
          handleCreateNewCase={handleCreateNewCase}
          handleEditCase={handleEditCase}
          handleUpdateStatus={handleUpdateStatus}
          handleUpdatePriority={handleUpdatePriority}
          handleUpdateDeadline={handleUpdateDeadline}
          handleUpdateNotes={handleUpdateNotes}
        />
      </main>

      {/* Force Dialog to be controlled only by state */}
      <Dialog 
        open={isCreateCaseDialogOpen} 
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange:", open);
          setIsCreateCaseDialogOpen(open);
        }}
      >
        <CreateCaseDialog 
          newCaseName={newCaseName}
          setNewCaseName={setNewCaseName}
          handleCreateCase={handleCreateNewCase}
        />
      </Dialog>

      <Dialog 
        open={isEditCaseDialogOpen} 
        onOpenChange={setIsEditCaseDialogOpen}
      >
        <EditCaseDialog 
          isEditCaseDialogOpen={isEditCaseDialogOpen}
          setIsEditCaseDialogOpen={setIsEditCaseDialogOpen}
          editCaseName={editCaseName}
          setEditCaseName={setEditCaseName}
          editClientName={editClientName}
          setEditClientName={setEditClientName}
          editCaseStatus={editCaseStatus}
          setEditCaseStatus={setEditCaseStatus}
          editCasePriority={editCasePriority}
          setEditCasePriority={setEditCasePriority}
          editCaseDeadline={editCaseDeadline}
          setEditCaseDeadline={setEditCaseDeadline}
          editCaseDescription={editCaseDescription}
          setEditCaseDescription={setEditCaseDescription}
          handleSaveEditCase={handleSaveEditCase}
        />
      </Dialog>
    </div>
  );
};

export default CaseManagementContainer;
