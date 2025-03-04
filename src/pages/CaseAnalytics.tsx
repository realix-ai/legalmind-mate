
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBar, AlertCircle } from 'lucide-react';
import { useCaseManagement } from '@/hooks/case-management';
import CaseAnalyticsDashboard from '@/components/case-management/analytics/CaseAnalyticsDashboard';
import CaseStatsCards from '@/components/case-management/analytics/CaseStatsCards';

const CaseAnalytics = () => {
  const { cases, isLoading, statistics, loadCases } = useCaseManagement();
  
  useEffect(() => {
    loadCases();
  }, [loadCases]);
  
  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <ChartBar className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Case Analytics</h1>
      </motion.div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : cases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-center"
        >
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No cases found</h2>
          <p className="text-muted-foreground mb-6">
            Create some cases to see analytics data
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <CaseStatsCards statistics={statistics} />
          <CaseAnalyticsDashboard statistics={statistics} />
        </div>
      )}
    </div>
  );
};

export default CaseAnalytics;
