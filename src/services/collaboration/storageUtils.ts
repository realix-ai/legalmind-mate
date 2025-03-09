
import { TeamMember, SharedQuery, ActivityItem } from './types';

// Helper function to get user prefix for storage keys
const getUserPrefix = (): string => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return `user_${user.id}_`;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  } catch (e) {
    console.error('Error getting user prefix:', e);
  }
  return '';
};

// Load team members from localStorage or initialize with defaults
export const getTeamMembersFromStorage = (): TeamMember[] => {
  const stored = localStorage.getItem(`${getUserPrefix()}teamMembers`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing team members from storage', e);
    }
  }
  
  // Default team members
  return [
    { id: '1', name: 'Sarah Johnson', role: 'Senior Partner', initials: 'SJ', email: 'sarah@legalfirm.com' },
    { id: '2', name: 'David Chen', role: 'Associate', initials: 'DC', email: 'david@legalfirm.com' },
    { id: '3', name: 'Lisa Warren', role: 'Paralegal', initials: 'LW', email: 'lisa@legalfirm.com' },
    { id: '4', name: 'Mark Thompson', role: 'Legal Researcher', initials: 'MT', email: 'mark@legalfirm.com' }
  ];
};

// Save team members to localStorage
export const saveTeamMembers = (members: TeamMember[]): void => {
  localStorage.setItem(`${getUserPrefix()}teamMembers`, JSON.stringify(members));
};

// Load shared queries from localStorage or initialize with defaults
export const getSharedQueriesFromStorage = (): SharedQuery[] => {
  const stored = localStorage.getItem(`${getUserPrefix()}sharedQueries`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing shared queries from storage', e);
    }
  }
  
  // Default shared queries
  return [
    {
      id: '1',
      query: 'Analysis of contract termination clause implications',
      sharedBy: 'Lisa Warren',
      sharedById: '3',
      date: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      type: 'legal-research'
    },
    {
      id: '2',
      query: 'Risk assessment for Smith v. Johnson precedent in our current case',
      sharedBy: 'Mark Thompson',
      sharedById: '4',
      date: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
      type: 'risk-analysis'
    }
  ];
};

// Save shared queries to localStorage
export const saveSharedQueries = (queries: SharedQuery[]): void => {
  localStorage.setItem(`${getUserPrefix()}sharedQueries`, JSON.stringify(queries));
};

// Load activity items from localStorage or initialize with defaults
export const getActivityItemsFromStorage = (): ActivityItem[] => {
  const stored = localStorage.getItem(`${getUserPrefix()}activityItems`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing activity items from storage', e);
    }
  }
  
  // Default activity items
  return [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      action: 'shared a new legal research query',
      timestamp: Date.now() - 6 * 60 * 60 * 1000 // Today
    },
    {
      id: '2',
      userId: '2',
      userName: 'David Chen',
      action: 'commented on your risk analysis',
      timestamp: Date.now() - 28 * 60 * 60 * 1000 // Yesterday
    },
    {
      id: '3',
      userId: '4',
      userName: 'Mark Thompson',
      action: 'created a new document based on your query',
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
    }
  ];
};

// Save activity items to localStorage
export const saveActivityItems = (items: ActivityItem[]): void => {
  localStorage.setItem(`${getUserPrefix()}activityItems`, JSON.stringify(items));
};
