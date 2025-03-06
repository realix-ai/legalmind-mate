
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserActivity } from "@/services/usageDataService";

interface RecentActivityTableProps {
  activities: UserActivity[];
  selectedUserId: string | null;
  isLoading: boolean;
}

const RecentActivityTable = ({ activities, selectedUserId, isLoading }: RecentActivityTableProps) => {
  // Filter activities for the selected user
  const filteredActivities = selectedUserId
    ? activities.filter(activity => activity.userId === selectedUserId)
    : activities;

  // Sort by timestamp (most recent first) and take the 10 most recent
  const recentActivities = [...filteredActivities]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (recentActivities.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activity found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No activity data available for this user</p>
        </CardContent>
      </Card>
    );
  }

  const getActionDetails = (activity: UserActivity): string => {
    switch (activity.actionType) {
      case 'query':
        return `Query type: ${activity.details?.queryType || 'unknown'}`;
      case 'document_created':
        return `Document type: ${activity.details?.documentType || 'unknown'}`;
      case 'case_created':
        return `Case ID: ${activity.details?.caseId || 'unknown'}`;
      default:
        return '';
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest user actions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">
                  {activity.actionType.replace('_', ' ')}
                </TableCell>
                <TableCell>{getActionDetails(activity)}</TableCell>
                <TableCell>User {activity.userId}</TableCell>
                <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
