
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, MessageSquare, Users, FileText, Bell } from 'lucide-react';
import { Notification } from '@/services/collaboration/notificationTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { markNotificationAsRead, deleteNotification, updateSharedResponseStatus } from '@/services/collaboration/notificationService';
import { toast } from 'sonner';

interface NotificationItemProps {
  notification: Notification;
  onAction: () => void;
}

export function NotificationItem({ notification, onAction }: NotificationItemProps) {
  const { id, type, title, message, date, read, from, data } = notification;
  
  const handleAccept = () => {
    if (data?.responseId) {
      updateSharedResponseStatus(data.responseId, 'accepted');
      toast.success('Response accepted and saved to your system');
      markNotificationAsRead(id);
      onAction();
    }
  };
  
  const handleDecline = () => {
    if (data?.responseId) {
      updateSharedResponseStatus(data.responseId, 'declined');
      toast.info('Response declined');
      markNotificationAsRead(id);
      onAction();
    }
  };
  
  const handleDismiss = () => {
    deleteNotification(id);
    onAction();
  };
  
  const getIcon = () => {
    switch (type) {
      case 'response_shared':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'document_shared':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'mention':
        return <Users className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card className={`relative ${read ? 'bg-background' : 'bg-muted/20'}`}>
      {!read && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500"></div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0 bg-background rounded-full p-2 border">
            {getIcon()}
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-medium">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{message}</p>
            <div className="text-xs text-muted-foreground mt-1">
              From {from.name} • {formatDistanceToNow(date, { addSuffix: true })}
            </div>
            
            {type === 'response_shared' && !read && (
              <div className="mt-3 flex space-x-2">
                <Button variant="default" size="sm" onClick={handleAccept}>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Accept
                </Button>
                <Button variant="outline" size="sm" onClick={handleDecline}>
                  <XCircle className="mr-1 h-3 w-3" />
                  Decline
                </Button>
              </div>
            )}
            
            {read && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={handleDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
