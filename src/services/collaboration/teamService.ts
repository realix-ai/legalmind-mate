
import { TeamMember, ActivityItem } from './types';
import { getTeamMembersFromStorage, saveTeamMembers } from './storageUtils';
import { addActivityItem } from './activityService';
import { useAuth } from '@/contexts/AuthContext';

// Export team member management functions
export const getTeamMembers = (): TeamMember[] => {
  return getTeamMembersFromStorage();
};

export const addTeamMember = (member: Omit<TeamMember, 'id'>): TeamMember => {
  const members = getTeamMembers();
  
  // Check if member with this email already exists
  if (member.email && members.some(m => m.email === member.email)) {
    throw new Error(`A team member with email ${member.email} already exists`);
  }
  
  const newMember = {
    ...member,
    id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  };
  
  members.push(newMember);
  saveTeamMembers(members);
  
  // Add activity item
  addActivityItem({
    userId: '1', // Current user
    userName: 'You',
    action: `added ${member.name} to the team`,
    title: 'New Team Member'
  });
  
  return newMember;
};

export const removeTeamMember = (id: string): boolean => {
  const members = getTeamMembers();
  const memberToRemove = members.find(m => m.id === id);
  
  if (!memberToRemove) {
    return false;
  }
  
  const filtered = members.filter(m => m.id !== id);
  
  if (filtered.length < members.length) {
    saveTeamMembers(filtered);
    
    // Add activity item
    addActivityItem({
      userId: '1', // Current user
      userName: 'You',
      action: `removed ${memberToRemove.name} from the team`,
      title: 'Team Member Removed'
    });
    
    return true;
  }
  
  return false;
};

// Invite a team member by email
export const inviteTeamMember = async (email: string): Promise<boolean> => {
  if (!email || !email.includes('@')) {
    return false;
  }
  
  // Check if member with this email already exists
  const existingMembers = getTeamMembers();
  if (existingMembers.some(m => m.email === email)) {
    throw new Error(`A team member with email ${email} already exists`);
  }
  
  try {
    // In a real application, this would send an email via a backend service
    // Simulate API call with async/await to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`Inviting team member: ${email}`);
    
    // Create a team member from the email
    const name = email.split('@')[0];
    const formattedName = name
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
      
    const initials = name
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
    
    // Add a new team member to represent the invitation
    addTeamMember({
      name: `${formattedName}`,
      role: 'Invited User',
      initials: initials,
      email: email,
      status: 'offline'
    });
    
    // Add activity
    addActivityItem({
      userId: '1', // Current user
      userName: 'You',
      action: `invited a new member (${email}) to the team`,
      title: 'Team Invitation Sent'
    });
    
    return true;
  } catch (error) {
    console.error('Error inviting team member:', error);
    return false;
  }
};

// Accept an invitation (simulate this for the demo)
export const acceptInvitation = (memberId: string): boolean => {
  const members = getTeamMembers();
  const memberIndex = members.findIndex(m => m.id === memberId);
  
  if (memberIndex === -1) {
    return false;
  }
  
  // Update the member's role and status
  members[memberIndex] = {
    ...members[memberIndex],
    role: 'Team Member',
    status: 'online'
  };
  
  saveTeamMembers(members);
  
  // Add activity
  addActivityItem({
    userId: memberId,
    userName: members[memberIndex].name,
    action: 'accepted the team invitation',
    title: 'Invitation Accepted'
  });
  
  return true;
};
