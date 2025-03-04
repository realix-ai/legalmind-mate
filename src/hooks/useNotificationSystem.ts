
import { useState, useEffect } from 'react';
import { 
  getNotifications, 
  addNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  checkDeadlineNotifications,
  Notification
} from '@/services/notificationService';

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications
  useEffect(() => {
    const loadedNotifications = getNotifications();
    setNotifications(loadedNotifications);
    setUnreadCount(loadedNotifications.filter(n => !n.read).length);
    
    // Check for deadline notifications
    checkDeadlineNotifications();
    
    // Set up periodic checks for notifications
    const intervalId = setInterval(() => {
      checkDeadlineNotifications();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Create notification
  const createNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
    category: 'case' | 'document' | 'research' | 'system',
    relatedItemId?: string,
    link?: string
  ) => {
    const newNotification = addNotification(title, message, type, category, relatedItemId, link);
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    return newNotification;
  };
  
  // Mark as read
  const markAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  // Delete notification
  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    deleteNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  return {
    notifications,
    unreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  };
};
