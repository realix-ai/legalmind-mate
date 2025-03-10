
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Notification } from '@/services/collaboration/notificationTypes';
import { getNotifications } from '@/services/collaboration/notificationService';
import { NotificationList } from '@/components/notifications/NotificationList';
import { Badge } from '@/components/ui/badge';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  // Load notifications when component mounts and when dropdown opens
  useEffect(() => {
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
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <NotificationList 
          notifications={notifications} 
          onAction={refreshNotifications}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
