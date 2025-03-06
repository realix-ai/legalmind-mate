
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserUsageStats } from "@/services/usageDataService";
import { BookOpen, FileText, Folder } from "lucide-react";

interface UsageOverviewCardProps {
  stats: UserUsageStats | null;
  isLoading: boolean;
}

const UsageOverviewCard = ({ stats, isLoading }: UsageOverviewCardProps) => {
  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a user to view their statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>User activity summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <span className="text-2xl font-bold">{stats.totalQueries}</span>
            <span className="text-sm text-muted-foreground">Queries</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <span className="text-2xl font-bold">{stats.totalDocuments}</span>
            <span className="text-sm text-muted-foreground">Documents</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <Folder className="h-8 w-8 text-primary mb-2" />
            <span className="text-2xl font-bold">{stats.totalCases}</span>
            <span className="text-sm text-muted-foreground">Cases</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Last active: {stats.lastActive ? new Date(stats.lastActive).toLocaleString() : 'Never'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageOverviewCard;
