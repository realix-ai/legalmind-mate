
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useUsageData } from '@/hooks/useUsageData';
import UsageOverviewCard from '@/components/admin/UsageOverviewCard';
import QueryTypeChart from '@/components/admin/QueryTypeChart';
import ActivityTimeline from '@/components/admin/ActivityTimeline';
import UserSelector from '@/components/admin/UserSelector';
import RecentActivityTable from '@/components/admin/RecentActivityTable';

const UsageDashboard = () => {
  const {
    activities,
    stats,
    selectedUserId,
    selectUser,
    getSelectedUserStats,
    isLoading
  } = useUsageData();

  const selectedUserStats = getSelectedUserStats();

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
      opacity: 1
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
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold">Usage Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor user activity and system usage
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mb-6">
            <UserSelector
              users={stats}
              selectedUserId={selectedUserId}
              onSelectUser={selectUser}
              isLoading={isLoading}
            />
            <UsageOverviewCard
              stats={selectedUserStats}
              isLoading={isLoading}
            />
            <QueryTypeChart
              stats={selectedUserStats}
              isLoading={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 mb-6">
            <ActivityTimeline
              stats={selectedUserStats}
              isLoading={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecentActivityTable
              activities={activities}
              selectedUserId={selectedUserId}
              isLoading={isLoading}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default UsageDashboard;
