
import { Notification, SharedResponse } from './notificationTypes';
import { TeamMember } from './types';
import { getTeamMembers } from './teamService';
import { addActivityItem } from './activityService';

// Get notifications from localStorage
export const getNotifications = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

// Save notifications to localStorage
export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

// Get shared responses from localStorage
export const getSharedResponses = (): SharedResponse[] => {
  try {
    const storedResponses = localStorage.getItem('shared_responses');
    return storedResponses ? JSON.parse(storedResponses) : [];
  } catch (error) {
    console.error('Error getting shared responses:', error);
    return [];
  }
};

// Save shared responses to localStorage
export const saveSharedResponses = (responses: SharedResponse[]): void => {
  try {
    localStorage.setItem('shared_responses', JSON.stringify(responses));
  } catch (error) {
    console.error('Error saving shared responses:', error);
  }
};

// Add a new notification
export const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>): Notification => {
  const notifications = getNotifications();
  
  const newNotification: Notification = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    date: Date.now(),
    read: false
  };
  
  notifications.unshift(newNotification);
  saveNotifications(notifications);
  
  return newNotification;
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, read: true } 
      : notification
  );
  
  saveNotifications(updatedNotifications);
  return true;
};

// Delete a notification
export const deleteNotification = (notificationId: string): boolean => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
  
  saveNotifications(updatedNotifications);
  return true;
};

// Share a response with colleagues
export const shareResponse = (
  content: string,
  recipients: string[],
  query?: string,
  title?: string
): SharedResponse => {
  // Create the shared response
  const sharedResponse: SharedResponse = {
    id: `shared-response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    content,
    sharedBy: 'You',
    sharedById: 'current-user',
    sharedWith: recipients,
    date: Date.now(),
    query,
    title: title || 'Query Response',
    status: 'pending'
  };
  
  // Save the shared response
  const sharedResponses = getSharedResponses();
  sharedResponses.unshift(sharedResponse);
  saveSharedResponses(sharedResponses);
  
  // Create notifications for each recipient
  const teamMembers = getTeamMembers();
  recipients.forEach(recipientId => {
    const recipient = teamMembers.find(member => member.id === recipientId);
    if (recipient) {
      addNotification({
        type: 'response_shared',
        title: 'New Response Shared With You',
        message: `"${title || 'Query Response'}" has been shared with you`,
        from: {
          id: 'current-user',
          name: 'You'
        },
        data: {
          responseId: sharedResponse.id,
          content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
        }
      });
    }
  });
  
  // Add activity
  addActivityItem({
    userId: 'current-user',
    userName: 'You',
    action: `shared a response with ${recipients.length} team member${recipients.length > 1 ? 's' : ''}`,
    title: title || 'Query Response'
  });
  
  return sharedResponse;
};

// Update the status of a shared response
export const updateSharedResponseStatus = (
  responseId: string, 
  status: 'accepted' | 'declined'
): boolean => {
  const sharedResponses = getSharedResponses();
  const updatedResponses = sharedResponses.map(response => 
    response.id === responseId 
      ? { ...response, status } 
      : response
  );
  
  saveSharedResponses(updatedResponses);
  
  // Add activity
  addActivityItem({
    userId: 'current-user',
    userName: 'You',
    action: `${status} a shared response`,
    title: sharedResponses.find(r => r.id === responseId)?.title || 'Query Response'
  });
  
  return true;
};
