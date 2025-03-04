
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, Calendar, FileText, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';
import { format, isToday, isYesterday } from 'date-fns';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    markAsRead, 
    clearAll 
  } = useNotifications();
  
  // Close notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#notification-center') && !target.closest('#notification-trigger')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
      case 'deadline':
        return <Calendar className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getNotificationColor = (type: Notification['type']) => {
    switch(type) {
      case 'deadline':
        return 'text-amber-500';
      case 'document':
        return 'text-blue-500';
      case 'comment':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };
  
  const groupNotificationsByDate = () => {
    const groups: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      let key: string;
      
      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else {
        key = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(notification);
    });
    
    return Object.entries(groups);
  };
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        id="notification-trigger"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500"
            variant="destructive"
          >
            <span className="text-[10px]">{unreadCount}</span>
          </Badge>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="notification-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 border-b flex items-center justify-between bg-muted/50">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <>
                  {groupNotificationsByDate().map(([date, items]) => (
                    <div key={date}>
                      <div className="px-3 py-1 bg-muted/30 text-xs font-medium text-muted-foreground">
                        {date}
                      </div>
                      {items.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b hover:bg-muted/30 transition-colors flex items-start gap-3 ${
                            !notification.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className={`rounded-full p-2 ${getNotificationColor(notification.type)} bg-opacity-10`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                {notification.title}
                              </p>
                              <div className="flex items-center ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  <div className="p-3 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full text-xs"
                      onClick={clearAll}
                    >
                      Clear all notifications
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
