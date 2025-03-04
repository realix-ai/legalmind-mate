import { useState } from 'react';
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

export const useCaseCrud = () => {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCreateCase = (caseName: string) => {
    if (!caseName.trim()) {
      toast.error('Please enter a case name');
      return null;
    }
    
    try {
      const newCase = createCase(caseName);
      setCases([...cases, newCase]);
      toast.success('Case created successfully');
      return newCase;
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
      return null;
    }
  };

  const handleUpdateCase = (
    caseId: string, 
    caseData: {
      name: string;
      status: 'active' | 'pending' | 'closed';
      priority: 'high' | 'medium' | 'low';
      deadline?: number;
      notes?: string;
    }
  ) => {
    try {
      console.log("Updating case with values:", caseData);

      const updatedCase = updateCaseDetails(caseId, caseData);
      
      if (updatedCase) {
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === caseId ? updatedCase : c
          )
        );
        toast.success('Case updated successfully');
        return updatedCase;
      }
      return null;
    } catch (error) {
      console.error('Error updating case:', error);
      toast.error('Failed to update case');
      return null;
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
        return updatedCase;
      }
      return null;
    } catch (error) {
      console.error('Error updating case status:', error);
      toast.error('Failed to update case status');
      return null;
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
        return updatedCase;
      }
      return null;
    } catch (error) {
      console.error('Error updating case priority:', error);
      toast.error('Failed to update case priority');
      return null;
    }
  };

  const handleUpdateDeadline = (caseId: string, newDeadline: Date | undefined) => {
    try {
      const deadlineTimestamp = newDeadline ? newDeadline.getTime() : undefined;
      console.log(`Updating case ${caseId} deadline to:`, newDeadline);
      console.log("Converting to timestamp:", deadlineTimestamp);
      
      const updatedCase = updateCaseDeadline(caseId, deadlineTimestamp);
      
      if (updatedCase) {
        console.log("Case successfully updated with new deadline:", updatedCase);
        setCases(prevCases => 
          prevCases.map(c => 
            c.id === caseId ? updatedCase : c
          )
        );
        toast.success(`Deadline updated to ${newDeadline ? format(newDeadline, 'PPP') : 'none'}`);
        return updatedCase;
      }
      console.error("Failed to update case deadline - no case returned");
      return null;
    } catch (error) {
      console.error('Error updating case deadline:', error);
      toast.error('Failed to update case deadline');
      return null;
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
        return updatedCase;
      }
      return null;
    } catch (error) {
      console.error('Error updating case notes:', error);
      toast.error('Failed to update case notes');
      return null;
    }
  };

  return {
    cases,
    isLoading,
    loadCases,
    handleCreateCase,
    handleUpdateCase,
    handleUpdateStatus,
    handleUpdatePriority,
    handleUpdateDeadline,
    handleUpdateNotes
  };
};
