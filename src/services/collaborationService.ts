
// Collaboration service to handle sharing and team functionalities

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  avatar?: string;
}

export interface SharedQuery {
  id: string;
  query: string;
  sharedBy: string;
  sharedById: string;
  date: number;
  type: string;
  url?: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target?: string;
  timestamp: number;
}

// Load team members from localStorage or initialize with defaults
const getTeamMembersFromStorage = (): TeamMember[] => {
  const stored = localStorage.getItem('teamMembers');
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
const saveTeamMembers = (members: TeamMember[]): void => {
  localStorage.setItem('teamMembers', JSON.stringify(members));
};

// Load shared queries from localStorage or initialize with defaults
const getSharedQueriesFromStorage = (): SharedQuery[] => {
  const stored = localStorage.getItem('sharedQueries');
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
const saveSharedQueries = (queries: SharedQuery[]): void => {
  localStorage.setItem('sharedQueries', JSON.stringify(queries));
};

// Load activity items from localStorage or initialize with defaults
const getActivityItemsFromStorage = (): ActivityItem[] => {
  const stored = localStorage.getItem('activityItems');
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
const saveActivityItems = (items: ActivityItem[]): void => {
  localStorage.setItem('activityItems', JSON.stringify(items));
};

// Export team member management functions
export const getTeamMembers = (): TeamMember[] => {
  return getTeamMembersFromStorage();
};

export const addTeamMember = (member: Omit<TeamMember, 'id'>): TeamMember => {
  const members = getTeamMembers();
  const newMember = {
    ...member,
    id: `member-${Date.now()}`
  };
  
  members.push(newMember);
  saveTeamMembers(members);
  
  // Add activity item
  addActivityItem({
    userId: '1', // Current user
    userName: 'You',
    action: `invited ${member.name} to the team`
  });
  
  return newMember;
};

export const removeTeamMember = (id: string): boolean => {
  const members = getTeamMembers();
  const filtered = members.filter(m => m.id !== id);
  
  if (filtered.length < members.length) {
    saveTeamMembers(filtered);
    return true;
  }
  
  return false;
};

// Export shared query management functions
export const getSharedQueries = (): SharedQuery[] => {
  return getSharedQueriesFromStorage();
};

export const shareQuery = (query: string, type: string, userId: string = '1', userName: string = 'You'): SharedQuery => {
  const queries = getSharedQueries();
  const newQuery = {
    id: `query-${Date.now()}`,
    query,
    sharedBy: userName,
    sharedById: userId,
    date: Date.now(),
    type,
    url: `${window.location.origin}/share/${Math.random().toString(36).substring(2, 8)}`
  };
  
  queries.push(newQuery);
  saveSharedQueries(queries);
  
  // Add activity item
  addActivityItem({
    userId,
    userName,
    action: 'shared a new query',
    target: type
  });
  
  return newQuery;
};

export const deleteSharedQuery = (id: string): boolean => {
  const queries = getSharedQueries();
  const filtered = queries.filter(q => q.id !== id);
  
  if (filtered.length < queries.length) {
    saveSharedQueries(filtered);
    return true;
  }
  
  return false;
};

// Export activity management functions
export const getActivityItems = (): ActivityItem[] => {
  return getActivityItemsFromStorage();
};

export const addActivityItem = (item: Omit<ActivityItem, 'id' | 'timestamp'>): ActivityItem => {
  const items = getActivityItems();
  const newItem = {
    ...item,
    id: `activity-${Date.now()}`,
    timestamp: Date.now()
  };
  
  items.unshift(newItem); // Add to the beginning
  
  // Limit to 50 items
  if (items.length > 50) {
    items.pop();
  }
  
  saveActivityItems(items);
  return newItem;
};

// Generate a unique sharing link
export const generateShareLink = (query: string): string => {
  // In a real application, this would create a unique identifier and save the query
  const shareId = Math.random().toString(36).substring(2, 12);
  return `${window.location.origin}/share/${shareId}`;
};

// Invite a team member by email
export const inviteTeamMember = (email: string): boolean => {
  if (!email || !email.includes('@')) {
    return false;
  }
  
  // In a real application, this would send an email
  console.log(`Invitation sent to ${email}`);
  
  // Add activity
  addActivityItem({
    userId: '1', // Current user
    userName: 'You',
    action: `invited a new member (${email}) to the team`
  });
  
  return true;
};
