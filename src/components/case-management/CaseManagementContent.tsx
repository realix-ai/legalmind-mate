
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CaseHeader from './CaseHeader';
import SearchAndFilters from './SearchAndFilters';
import FiltersPanel from './FiltersPanel';
import CaseGrid from './CaseGrid';
import EmptyCaseState from './EmptyCaseState';

interface CaseManagementContentProps {
  cases: any[];
  filteredCases: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  priorityFilter: string[];
  setPriorityFilter: (filter: string[]) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
  setIsCreateCaseDialogOpen: (isOpen: boolean) => void;
  isCreateCaseDialogOpen: boolean;
  handleCreateNewCase: () => void;
  handleEditCase: (e: React.MouseEvent, caseId: string) => void;
  handleUpdateStatus: (caseId: string, status: 'active' | 'pending' | 'closed') => void;
  handleUpdatePriority: (caseId: string, priority: 'high' | 'medium' | 'low') => void;
  handleUpdateDeadline: (caseId: string, deadline: Date | undefined) => void;
  handleUpdateNotes: (caseId: string, notes: string) => void;
}

const CaseManagementContent = ({
  cases,
  filteredCases,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  isFilterOpen,
  setIsFilterOpen,
  resetFilters,
  setIsCreateCaseDialogOpen,
  isCreateCaseDialogOpen,
  handleCreateNewCase,
  handleEditCase,
  handleUpdateStatus,
  handleUpdatePriority,
  handleUpdateDeadline,
  handleUpdateNotes
}: CaseManagementContentProps) => {
  const navigate = useNavigate();
  
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <CaseHeader 
        casesCount={filteredCases.length}
        setIsCreateCaseDialogOpen={setIsCreateCaseDialogOpen}
        isCreateCaseDialogOpen={isCreateCaseDialogOpen}
        onCreateCase={handleCreateNewCase}
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
  );
};

export default CaseManagementContent;
