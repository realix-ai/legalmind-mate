
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/types/notification';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  
  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n: Notification) => !n.read).length);
      } catch (e) {
        console.error('Error parsing notifications', e);
      }
    }
    
    // Check for cases with upcoming deadlines
    checkForDeadlineNotifications();
    
    // Set up interval to check regularly
    const interval = setInterval(checkForDeadlineNotifications, 1000 * 60 * 60); // Check every hour
    
    return () => clearInterval(interval);
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: uuidv4(),
      timestamp: Date.now(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for real-time notification
    toast(notification.title, {
      description: notification.message,
      action: {
        label: "View",
        onClick: () => {
          markAsRead(newNotification.id);
          if (notification.link) {
            navigate(notification.link);
          }
        }
      }
    });
    
    return newNotification;
  }, [navigate]);
  
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const checkForDeadlineNotifications = useCallback(() => {
    // Load cases from localStorage
    const storedCases = localStorage.getItem('cases');
    if (!storedCases) return;
    
    try {
      const cases = JSON.parse(storedCases);
      const now = Date.now();
      
      cases.forEach((caseItem: any) => {
        if (caseItem.deadline && caseItem.status !== 'closed') {
          const deadlineDate = new Date(caseItem.deadline);
          const timeUntilDeadline = deadlineDate.getTime() - now;
          
          // 24 hours in milliseconds
          const oneDay = 24 * 60 * 60 * 1000;
          
          if (timeUntilDeadline > 0 && timeUntilDeadline <= oneDay) {
            // Check if we already have a notification for this deadline
            const alreadyNotified = notifications.some(
              n => n.type === 'deadline' && n.caseId === caseItem.id
            );
            
            if (!alreadyNotified) {
              addNotification({
                type: 'deadline',
                title: 'Upcoming Deadline',
                message: `Case "${caseItem.name}" is due within 24 hours`,
                caseId: caseItem.id,
                link: `/case-chat/${caseItem.id}`
              });
            }
          }
          
          // If the deadline has passed within the last 12 hours
          else if (timeUntilDeadline < 0 && timeUntilDeadline > -oneDay / 2) {
            const alreadyNotified = notifications.some(
              n => n.type === 'deadline' && n.caseId === caseItem.id && n.message.includes('has passed')
            );
            
            if (!alreadyNotified) {
              addNotification({
                type: 'deadline',
                title: 'Deadline Passed',
                message: `Deadline for case "${caseItem.name}" has passed`,
                caseId: caseItem.id,
                link: `/case-chat/${caseItem.id}`
              });
            }
          }
        }
      });
    } catch (e) {
      console.error('Error processing cases for deadline notifications', e);
    }
  }, [addNotification, notifications]);
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
};
