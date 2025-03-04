
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, AlertCircle, Info, FileText, Briefcase, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Notification } from '@/services/notificationService';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

const NotificationList = ({ notifications, onMarkAsRead, onDelete, onClose }: NotificationListProps) => {
  const navigate = useNavigate();
  
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="font-medium mb-1">No notifications</h3>
        <p className="text-sm text-muted-foreground">
          You're all caught up!
        </p>
      </div>
    );
  }
  
  const handleClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
      if (onClose) {
        onClose();
      }
    }
  };
  
  const getIcon = (notification: Notification) => {
    // First by type
    if (notification.type === 'error') return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (notification.type === 'warning') return <AlertCircle className="h-4 w-4 text-amber-500" />;
    if (notification.type === 'success') return <Check className="h-4 w-4 text-green-500" />;
    
    // Then by category
    if (notification.category === 'case') return <Briefcase className="h-4 w-4 text-primary" />;
    if (notification.category === 'document') return <FileText className="h-4 w-4 text-primary" />;
    if (notification.category === 'research') return <Search className="h-4 w-4 text-primary" />;
    
    return <Info className="h-4 w-4 text-primary" />;
  };
  
  return (
    <div className="divide-y max-h-[400px] overflow-y-auto">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-4 hover:bg-muted/50 cursor-pointer ${notification.read ? 'bg-transparent' : 'bg-primary/5'}`}
          onClick={() => handleClick(notification)}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              notification.type === 'error' ? 'bg-red-100' :
              notification.type === 'warning' ? 'bg-amber-100' :
              notification.type === 'success' ? 'bg-green-100' :
              'bg-blue-100'
            }`}>
              {getIcon(notification)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
            >
              <span className="sr-only">Delete</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
