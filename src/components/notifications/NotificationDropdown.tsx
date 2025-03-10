
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import { getNotifications, deleteNotification } from '@/services/collaboration/notificationService';
import { Notification } from '@/services/collaboration/notificationTypes';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  // Load notifications on mount and when dropdown opens
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);
  
  // Check for new notifications every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
  };
  
  const handleClearAll = () => {
    const notificationIds = notifications.map(notif => notif.id);
    notificationIds.forEach(id => deleteNotification(id));
    setNotifications([]);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] px-[5px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-7 text-xs">
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          <DropdownMenuGroup className="p-2 space-y-2">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id}>
                  <NotificationItem 
                    notification={notification} 
                    onAction={loadNotifications}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto opacity-20 mb-2" />
                <p>No notifications yet</p>
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
