
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useCaseManagement } from '@/hooks/useCaseManagement';
import CaseHeader from '@/components/case-management/CaseHeader';
import SearchAndFilters from '@/components/case-management/SearchAndFilters';
import FiltersPanel from '@/components/case-management/FiltersPanel';
import CaseGrid from '@/components/case-management/CaseGrid';
import EmptyCaseState from '@/components/case-management/EmptyCaseState';
import CreateCaseDialog from '@/components/case-management/CreateCaseDialog';
import EditCaseDialog from '@/components/case-management/EditCaseDialog';
import { Dialog } from '@/components/ui/dialog';

const CaseManagement = () => {
  const navigate = useNavigate();
  const {
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
  } = useCaseManagement();

  const handleCaseClick = (caseId: string) => {
    navigate(`/case-chat/${caseId}`);
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
          handleCreateCase={handleCreateCase}
        />
      </Dialog>

      <Dialog open={isEditCaseDialogOpen} onOpenChange={setIsEditCaseDialogOpen}>
        <EditCaseDialog 
          isEditCaseDialogOpen={isEditCaseDialogOpen}
          setIsEditCaseDialogOpen={setIsEditCaseDialogOpen}
          editCaseName={editCaseName}
          setEditCaseName={setEditCaseName}
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
