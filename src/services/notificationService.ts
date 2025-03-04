
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  link?: string;
  category: 'case' | 'document' | 'research' | 'system';
  relatedItemId?: string;
}

// Get notifications from localStorage
export const getNotifications = (): Notification[] => {
  const saved = localStorage.getItem('notifications');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing notifications', e);
    return [];
  }
};

// Save notifications to localStorage
export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

// Add a new notification
export const addNotification = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  category: 'case' | 'document' | 'research' | 'system',
  relatedItemId?: string,
  link?: string
): Notification => {
  const notifications = getNotifications();
  
  const newNotification: Notification = {
    id: `notification-${Date.now()}`,
    title,
    message,
    type,
    timestamp: Date.now(),
    read: false,
    link,
    category,
    relatedItemId
  };
  
  // Add to beginning of array
  notifications.unshift(newNotification);
  
  // Limit to 100 notifications
  if (notifications.length > 100) {
    notifications.pop();
  }
  
  saveNotifications(notifications);
  
  // Show toast for non-read notifications
  if (!newNotification.read) {
    switch (type) {
      case 'success':
        toast.success(title, { description: message });
        break;
      case 'warning':
        toast.warning(title, { description: message });
        break;
      case 'error':
        toast.error(title, { description: message });
        break;
      default:
        toast(title, { description: message });
    }
  }
  
  return newNotification;
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(notification => 
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  saveNotifications(updated);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updated = notifications.map(notification => ({ ...notification, read: true }));
  saveNotifications(updated);
};

// Delete notification
export const deleteNotification = (notificationId: string): void => {
  const notifications = getNotifications();
  const updated = notifications.filter(notification => notification.id !== notificationId);
  saveNotifications(updated);
};

// Check for deadline notifications
export const checkDeadlineNotifications = (): void => {
  // This would typically be called on app initialization or periodically
  
  // Import case types
  import('@/utils/documents').then(({ getCases }) => {
    const cases = getCases();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    cases.forEach(caseItem => {
      if (caseItem.deadline && caseItem.status !== 'closed') {
        const timeUntilDeadline = caseItem.deadline - now;
        
        // Check if deadline is in less than one day
        if (timeUntilDeadline > 0 && timeUntilDeadline < oneDayMs) {
          // Check if notification already exists
          const notifications = getNotifications();
          const alreadyNotified = notifications.some(
            notification => 
              notification.relatedItemId === caseItem.id && 
              notification.title.includes('deadline')
          );
          
          if (!alreadyNotified) {
            addNotification(
              'Upcoming Case Deadline',
              `"${caseItem.name}" is due ${format(caseItem.deadline, 'PPP')}`,
              'warning',
              'case',
              caseItem.id,
              `/case/${caseItem.id}`
            );
          }
        }
      }
    });
  });
};
