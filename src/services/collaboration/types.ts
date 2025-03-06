
// Types used across collaboration services

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'active' | 'away' | 'offline';
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
  title?: string; // Add title field to ActivityItem
}
