
import React from 'react';
import { motion } from 'framer-motion';
import CaseStatusChart from './CaseStatusChart';
import CasePriorityChart from './CasePriorityChart';
import DeadlineTimeline from './DeadlineTimeline';
import { CaseStatistics } from '@/hooks/case-management/useCaseManagement';

interface CaseAnalyticsDashboardProps {
  statistics: CaseStatistics;
}

const CaseAnalyticsDashboard = ({ statistics }: CaseAnalyticsDashboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CaseStatusChart 
            activeCases={statistics.activeCases}
            pendingCases={statistics.pendingCases}
            closedCases={statistics.closedCases}
          />
        </div>
        <div className="lg:col-span-1">
          <CasePriorityChart 
            highPriority={statistics.highPriority}
            mediumPriority={statistics.mediumPriority}
            lowPriority={statistics.lowPriority}
          />
        </div>
        <div className="lg:col-span-1">
          <DeadlineTimeline 
            upcomingDeadlines={statistics.upcomingDeadlines}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CaseAnalyticsDashboard;
