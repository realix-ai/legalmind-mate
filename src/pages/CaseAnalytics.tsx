
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useCaseManagement } from '@/hooks/case-management';
import CaseStatsCards from '@/components/case-management/analytics/CaseStatsCards';
import CaseStatusChart from '@/components/case-management/analytics/CaseStatusChart';
import CasePriorityChart from '@/components/case-management/analytics/CasePriorityChart';
import DeadlineTimeline from '@/components/case-management/analytics/DeadlineTimeline';

const CaseAnalytics = () => {
  const { loadCases, cases, statistics } = useCaseManagement();
  
  useEffect(() => {
    loadCases();
  }, [loadCases]);
  
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
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
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
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">Case Analytics</h1>
            <p className="text-muted-foreground mb-8">Monitor your case workload and performance</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-8">
            <CaseStatsCards statistics={statistics} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CaseStatusChart 
              activeCases={statistics.activeCases}
              pendingCases={statistics.pendingCases}
              closedCases={statistics.closedCases}
            />
            <CasePriorityChart 
              highPriority={statistics.highPriority}
              mediumPriority={statistics.mediumPriority}
              lowPriority={statistics.lowPriority}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <DeadlineTimeline 
              upcomingDeadlines={statistics.upcomingDeadlines}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CaseAnalytics;
