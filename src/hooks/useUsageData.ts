
import { useState, useEffect } from 'react';
import { UserActivity, UserUsageStats, getUserActivities, getUserUsageStats, getAllUsersUsageStats } from '@/services/usageDataService';

export function useUsageData() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<Record<string, UserUsageStats>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all activities
        const allActivities = getUserActivities();
        setActivities(allActivities);
        
        // Fetch all users' stats
        const allStats = getAllUsersUsageStats();
        setStats(allStats);
        
        // Set first user as selected if none is selected
        if (!selectedUserId && Object.keys(allStats).length > 0) {
          setSelectedUserId(Object.keys(allStats)[0]);
        }
      } catch (error) {
        console.error('Error fetching usage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedUserId]);
  
  const selectUser = (userId: string) => {
    setSelectedUserId(userId);
  };
  
  const getSelectedUserStats = (): UserUsageStats | null => {
    if (!selectedUserId) return null;
    return stats[selectedUserId] || null;
  };
  
  return {
    activities,
    stats,
    selectedUserId,
    selectUser,
    getSelectedUserStats,
    isLoading
  };
}
