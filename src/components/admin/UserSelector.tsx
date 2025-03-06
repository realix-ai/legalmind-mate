
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserUsageStats } from "@/services/usageDataService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserSelectorProps {
  users: Record<string, UserUsageStats>;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
}

const UserSelector = ({ users, selectedUserId, onSelectUser, isLoading }: UserSelectorProps) => {
  const userIds = Object.keys(users);

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Select User</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-12">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (userIds.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Select User</CardTitle>
          <CardDescription>No users available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No user data found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Select User</CardTitle>
        <CardDescription>View usage statistics for a specific user</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedUserId || undefined}
          onValueChange={onSelectUser}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {userIds.map((userId) => (
              <SelectItem key={userId} value={userId}>
                User {userId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default UserSelector;
