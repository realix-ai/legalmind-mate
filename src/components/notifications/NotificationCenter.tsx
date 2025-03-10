
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationList } from './NotificationList';
import { getNotifications, markNotificationAsRead } from '@/services/collaboration/notificationService';
import { Notification } from '@/services/collaboration/notificationTypes';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications when component mounts and when sheet opens
  React.useEffect(() => {
    if (open) {
      refreshNotifications();
    }
  }, [open]);
  
  // Function to refresh notifications
  const refreshNotifications = () => {
    const allNotifications = getNotifications();
    setNotifications(allNotifications);
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
    refreshNotifications();
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="space-y-0 pb-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="text-xs h-8"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <NotificationList 
          notifications={notifications}
          onAction={refreshNotifications}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
