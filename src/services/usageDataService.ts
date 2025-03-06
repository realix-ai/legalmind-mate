
// This service handles the fetching and analysis of user usage data

// Define the data types for user usage information
export interface UserActivity {
  id: string;
  userId: string;
  actionType: 'query' | 'document_created' | 'case_created' | 'login';
  timestamp: number;
  details?: {
    queryType?: string;
    documentType?: string;
    caseId?: string;
  };
}

export interface UserUsageStats {
  totalQueries: number;
  totalDocuments: number;
  totalCases: number;
  queriesByType: Record<string, number>;
  activityTimeline: Array<{date: string, count: number}>;
  lastActive: number | null;
}

// Mock data for demonstration purposes
const MOCK_USER_ACTIVITIES: UserActivity[] = [
  { id: '1', userId: 'user1', actionType: 'query', timestamp: Date.now() - 1000000, details: { queryType: 'legal-research' } },
  { id: '2', userId: 'user1', actionType: 'document_created', timestamp: Date.now() - 900000, details: { documentType: 'contract' } },
  { id: '3', userId: 'user1', actionType: 'case_created', timestamp: Date.now() - 800000, details: { caseId: 'case1' } },
  { id: '4', userId: 'user1', actionType: 'query', timestamp: Date.now() - 700000, details: { queryType: 'risk-analysis' } },
  { id: '5', userId: 'user1', actionType: 'query', timestamp: Date.now() - 600000, details: { queryType: 'summarize' } },
  { id: '6', userId: 'user1', actionType: 'login', timestamp: Date.now() - 500000 },
  { id: '7', userId: 'user1', actionType: 'query', timestamp: Date.now() - 400000, details: { queryType: 'legal-research' } },
  { id: '8', userId: 'user1', actionType: 'document_created', timestamp: Date.now() - 300000, details: { documentType: 'brief' } },
  { id: '9', userId: 'user1', actionType: 'case_created', timestamp: Date.now() - 200000, details: { caseId: 'case2' } },
  { id: '10', userId: 'user1', actionType: 'login', timestamp: Date.now() - 100000 },
  { id: '11', userId: 'user2', actionType: 'query', timestamp: Date.now() - 950000, details: { queryType: 'data-analysis' } },
  { id: '12', userId: 'user2', actionType: 'document_created', timestamp: Date.now() - 850000, details: { documentType: 'memo' } },
  { id: '13', userId: 'user2', actionType: 'login', timestamp: Date.now() - 750000 },
  { id: '14', userId: 'user2', actionType: 'query', timestamp: Date.now() - 650000, details: { queryType: 'legal-research' } },
  { id: '15', userId: 'user2', actionType: 'case_created', timestamp: Date.now() - 550000, details: { caseId: 'case3' } },
];

export const getUserActivities = (userId?: string): UserActivity[] => {
  if (userId) {
    return MOCK_USER_ACTIVITIES.filter(activity => activity.userId === userId);
  }
  return MOCK_USER_ACTIVITIES;
};

export const getUserUsageStats = (userId: string): UserUsageStats => {
  const userActivities = getUserActivities(userId);
  
  // Initialize stats object
  const stats: UserUsageStats = {
    totalQueries: 0,
    totalDocuments: 0,
    totalCases: 0,
    queriesByType: {},
    activityTimeline: [],
    lastActive: null
  };
  
  // Calculate basic stats
  userActivities.forEach(activity => {
    if (activity.actionType === 'query') {
      stats.totalQueries++;
      const queryType = activity.details?.queryType || 'unknown';
      stats.queriesByType[queryType] = (stats.queriesByType[queryType] || 0) + 1;
    } else if (activity.actionType === 'document_created') {
      stats.totalDocuments++;
    } else if (activity.actionType === 'case_created') {
      stats.totalCases++;
    }
    
    // Track last active timestamp
    if (!stats.lastActive || activity.timestamp > stats.lastActive) {
      stats.lastActive = activity.timestamp;
    }
  });
  
  // Generate timeline data (last 7 days)
  const now = new Date();
  const timelineMap = new Map<string, number>();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    timelineMap.set(dateStr, 0);
  }
  
  userActivities.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dateStr = date.toISOString().split('T')[0];
    
    if (timelineMap.has(dateStr)) {
      timelineMap.set(dateStr, (timelineMap.get(dateStr) || 0) + 1);
    }
  });
  
  stats.activityTimeline = Array.from(timelineMap.entries()).map(([date, count]) => ({
    date,
    count
  }));
  
  return stats;
};

export const getAllUsersUsageStats = (): Record<string, UserUsageStats> => {
  // Get unique user IDs
  const userIds = Array.from(new Set(MOCK_USER_ACTIVITIES.map(a => a.userId)));
  
  // Get stats for each user
  const allStats: Record<string, UserUsageStats> = {};
  userIds.forEach(userId => {
    allStats[userId] = getUserUsageStats(userId);
  });
  
  return allStats;
};
