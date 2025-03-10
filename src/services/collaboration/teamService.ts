
import { TeamMember, ActivityItem } from './types';
import { getTeamMembersFromStorage, saveTeamMembers } from './storageUtils';
import { addActivityItem } from './activityService';

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

// Check if Outlook is connected
const isOutlookConnected = (): boolean => {
  return localStorage.getItem('outlook-connected') === 'true';
};

// Get user's Outlook email
const getUserOutlookEmail = (): string | null => {
  return localStorage.getItem('outlook-email');
};

// Invite a team member by email - send actual email if Outlook is connected
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
    
    // Check if Outlook is connected to send actual email
    const outlookConnected = isOutlookConnected();
    const senderEmail = getUserOutlookEmail();
    
    if (outlookConnected && senderEmail) {
      // In a real app, this would use the Outlook API to send an email
      // For now, we'll simulate the sending but log that a real email would be sent
      console.log(`Sending real invitation email via Outlook from ${senderEmail} to ${email}`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add activity item about the real email
      addActivityItem({
        userId: '1',
        userName: 'You',
        action: `sent an invitation email to ${email} via Outlook`,
        title: 'Team Invitation Email Sent'
      });
    } else {
      console.log(`Outlook not connected. Would send invitation email to: ${email}`);
    }
    
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
