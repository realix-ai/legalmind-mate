
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users } from 'lucide-react';
import { ActivityItem } from '@/services/collaborationService';

interface ActivityFeedProps {
  activityItems: ActivityItem[];
}

const ActivityFeed = ({ activityItems }: ActivityFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-4">No recent activity</p>
          ) : (
            activityItems.map((item) => (
              <ActivityItemComponent key={item.id} item={item} />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-xs">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ActivityItemComponentProps {
  item: ActivityItem;
}

const ActivityItemComponent = ({ item }: ActivityItemComponentProps) => {
  // Group by day
  const date = new Date(item.timestamp);
  let dateLabel: string;
  
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    dateLabel = 'Today';
  } else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = format(date, 'MMM d');
  }
  
  return (
    <div className="border-l-2 border-primary/30 pl-3 pb-4">
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{dateLabel} at {format(date, 'h:mm a')}</p>
      </div>
      <p className="text-sm mt-1">
        <span className="font-medium">{item.userName}</span> {item.action}
        {item.target && <span className="italic"> {item.target}</span>}
      </p>
    </div>
  );
};

export default ActivityFeed;
