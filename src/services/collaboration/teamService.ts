
import { TeamMember, ActivityItem } from './types';
import { getTeamMembersFromStorage, saveTeamMembers } from './storageUtils';
import { addActivityItem } from './activityService';

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
    action: `added ${member.name} to the team`
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

// Invite a team member by email
export const inviteTeamMember = (email: string): boolean => {
  if (!email || !email.includes('@')) {
    return false;
  }
  
  // In a real application, this would send an email via a backend service
  console.log(`Inviting team member: ${email}`);
  
  // Create a simulated team member from the email
  const name = email.split('@')[0];
  const initials = name.substring(0, 2).toUpperCase();
  
  // Add a new team member to represent the invitation
  addTeamMember({
    name: `${name} (Pending)`,
    role: 'Invited User',
    initials: initials,
    email: email
  });
  
  // Add activity
  addActivityItem({
    userId: '1', // Current user
    userName: 'You',
    action: `invited a new member (${email}) to the team`
  });
  
  return true;
};
