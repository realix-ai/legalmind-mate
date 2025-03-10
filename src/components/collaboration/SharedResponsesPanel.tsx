
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getSharedResponses, 
  updateSharedResponseStatus 
} from '@/services/collaboration/notificationService';
import { SharedResponse } from '@/services/collaboration/notificationTypes';
import { toast } from 'sonner';
import { Inbox, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export function SharedResponsesPanel() {
  const [sharedResponses, setSharedResponses] = useState<SharedResponse[]>([]);
  
  // Load shared responses on component mount
  useEffect(() => {
    refreshSharedResponses();
  }, []);
  
  const refreshSharedResponses = () => {
    const responses = getSharedResponses();
    setSharedResponses(responses);
  };
  
  const handleAccept = (responseId: string) => {
    updateSharedResponseStatus(responseId, 'accepted');
    toast.success('Response accepted');
    refreshSharedResponses();
  };
  
  const handleDecline = (responseId: string) => {
    updateSharedResponseStatus(responseId, 'declined');
    toast.info('Response declined');
    refreshSharedResponses();
  };
  
  // Get status badge color based on response status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
      case 'declined':
        return <Badge variant="outline">Declined</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Inbox className="h-5 w-5 text-primary" />
          Shared Responses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sharedResponses.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sharedResponses.map((response) => (
                <Card key={response.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{response.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Shared by {response.sharedBy} • {formatDistanceToNow(response.date, { addSuffix: true })}
                      </p>
                      {response.query && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Query: </span>
                          <span className="text-muted-foreground">{response.query}</span>
                        </div>
                      )}
                    </div>
                    <div>{getStatusBadge(response.status)}</div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-muted/30 rounded-md text-sm max-h-40 overflow-y-auto">
                    {/* Display a preview of the content */}
                    {response.content.length > 300 
                      ? `${response.content.substring(0, 300)}...` 
                      : response.content}
                  </div>
                  
                  {response.status === 'pending' && (
                    <div className="mt-3 flex space-x-2">
                      <Button variant="default" size="sm" onClick={() => handleAccept(response.id)}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDecline(response.id)}>
                        <XCircle className="mr-1 h-3 w-3" />
                        Decline
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No shared responses yet</p>
            <p className="text-sm mt-1">When colleagues share content with you, it will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
