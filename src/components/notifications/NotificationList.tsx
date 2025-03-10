
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/services/collaboration/notificationTypes';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/button';
import { markNotificationAsRead } from '@/services/collaboration/notificationService';

interface NotificationListProps {
  notifications: Notification[];
  onAction: () => void;
}

export function NotificationList({ notifications, onAction }: NotificationListProps) {
  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
    onAction();
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-semibold">Notifications</h4>
        {notifications.some(n => !n.read) && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col gap-2 p-2">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onAction={onAction}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
