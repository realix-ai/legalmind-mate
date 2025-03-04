
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCaseCrud } from './useCaseCrud';
import { Case as CaseType } from '@/utils/documents';

// Interface for case statistics
export interface CaseStatistics {
  totalCases: number;
  activeCases: number;
  pendingCases: number;
  closedCases: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  upcomingDeadlines: CaseType[];
  recentActivity: CaseType[];
}

// Hook that combines case CRUD operations with analytics
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
  
  const [statistics, setStatistics] = useState<CaseStatistics>({
    totalCases: 0,
    activeCases: 0,
    pendingCases: 0,
    closedCases: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    upcomingDeadlines: [],
    recentActivity: []
  });

  // Calculate statistics whenever cases change
  useEffect(() => {
    if (cases.length > 0) {
      const now = Date.now();
      const sevenDaysFromNow = now + (7 * 24 * 60 * 60 * 1000);
      
      // Count cases by status
      const activeCases = cases.filter(c => c.status === 'active').length;
      const pendingCases = cases.filter(c => c.status === 'pending').length;
      const closedCases = cases.filter(c => c.status === 'closed').length;
      
      // Count cases by priority
      const highPriority = cases.filter(c => c.priority === 'high').length;
      const mediumPriority = cases.filter(c => c.priority === 'medium').length;
      const lowPriority = cases.filter(c => c.priority === 'low').length;
      
      // Get upcoming deadlines (next 7 days)
      const upcomingDeadlines = cases
        .filter(c => c.deadline && c.deadline > now && c.deadline < sevenDaysFromNow)
        .sort((a, b) => (a.deadline || 0) - (b.deadline || 0));
        
      // Get recently modified cases
      const recentActivity = [...cases]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);
        
      setStatistics({
        totalCases: cases.length,
        activeCases,
        pendingCases,
        closedCases,
        highPriority,
        mediumPriority,
        lowPriority,
        upcomingDeadlines,
        recentActivity
      });
    }
  }, [cases]);
  
  return {
    cases,
    isLoading,
    statistics,
    loadCases,
    handleCreateCase,
    handleUpdateCase,
    handleUpdateStatus,
    handleUpdatePriority,
    handleUpdateDeadline,
    handleUpdateNotes
  };
};
