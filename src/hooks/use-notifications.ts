
import { useState, useEffect } from 'react';
import { Notification } from '@/services/collaboration/notificationTypes';
import { getNotifications, markNotificationAsRead, deleteNotification } from '@/services/collaboration/notificationService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications from storage
  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.read).length);
  };
  
  // Initial load and periodic refresh
  useEffect(() => {
    loadNotifications();
    
    // Check for new notifications periodically
    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };
  
  // Delete a notification
  const deleteNotif = (id: string) => {
    deleteNotification(id);
    loadNotifications();
  };
  
  // Clear all notifications
  const clearAll = () => {
    notifications.forEach(notif => {
      deleteNotification(notif.id);
    });
    loadNotifications();
  };
  
  return {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    deleteNotif,
    clearAll
  };
}
