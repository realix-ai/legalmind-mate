import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useCaseManagement } from '@/hooks/case-management';
import { useCaseFilters } from '@/hooks/case-management';
import { useCaseDialog } from '@/hooks/case-management';
import CaseHeader from '@/components/case-management/CaseHeader';
import SearchAndFilters from '@/components/case-management/SearchAndFilters';
import FiltersPanel from '@/components/case-management/FiltersPanel';
import CaseGrid from '@/components/case-management/CaseGrid';
import EmptyCaseState from '@/components/case-management/EmptyCaseState';
import CreateCaseDialog from '@/components/case-management/CreateCaseDialog';
import EditCaseDialog from '@/components/case-management/EditCaseDialog';
import { Dialog } from '@/components/ui/dialog';
import { useEffect } from 'react';

const CaseManagement = () => {
  const navigate = useNavigate();
  
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
  
  const handleCaseClick = (caseId: string) => {
    navigate(`/case-chat/${caseId}`);
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

  const handleCreateNewCase = () => {
    handleCreateCase(newCaseName);
    setNewCaseName('');
    setIsCreateCaseDialogOpen(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <CaseHeader 
            setIsCreateCaseDialogOpen={setIsCreateCaseDialogOpen}
            isCreateCaseDialogOpen={isCreateCaseDialogOpen}
          />
          
          <SearchAndFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
          />
          
          <FiltersPanel 
            isFilterOpen={isFilterOpen}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            resetFilters={resetFilters}
          />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCases.length > 0 ? (
            <CaseGrid 
              cases={filteredCases}
              handleCaseClick={handleCaseClick}
              handleEditCase={handleEditCase}
              handleUpdateStatus={handleUpdateStatus}
              handleUpdatePriority={handleUpdatePriority}
              handleUpdateDeadline={handleUpdateDeadline}
              handleUpdateNotes={handleUpdateNotes}
            />
          ) : (
            <EmptyCaseState 
              cases={cases}
              setIsCreateCaseDialogOpen={setIsCreateCaseDialogOpen}
              resetFilters={resetFilters}
            />
          )}
        </motion.div>
      </main>

      <Dialog open={isCreateCaseDialogOpen} onOpenChange={setIsCreateCaseDialogOpen}>
        <CreateCaseDialog 
          newCaseName={newCaseName}
          setNewCaseName={setNewCaseName}
          handleCreateCase={handleCreateNewCase}
        />
      </Dialog>

      <Dialog open={isEditCaseDialogOpen} onOpenChange={setIsEditCaseDialogOpen}>
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

export default CaseManagement;
