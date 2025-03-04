
import React from 'react';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Gauge, Calendar } from 'lucide-react';

type CaseStats = {
  total: number;
  active: number;
  pending: number;
  closed: number;
  highPriority: number;
  deadlinesThisWeek: number;
};

interface CaseStatsCardsProps {
  stats: CaseStats;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  color 
}: { 
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  color: string;
}) => (
  <div className="border rounded-lg p-6 bg-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className={`rounded-full p-2 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const CaseStatsCards = ({ stats }: CaseStatsCardsProps) => {
  const activePercentage = stats.total > 0 
    ? Math.round((stats.active / stats.total) * 100) 
    : 0;
  
  const closedPercentage = stats.total > 0 
    ? Math.round((stats.closed / stats.total) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        title="Total Cases"
        value={stats.total}
        icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        color="bg-blue-50 dark:bg-blue-900/20"
      />
      
      <StatCard
        title="Active Cases"
        value={stats.active}
        icon={<Clock className="h-5 w-5 text-green-500" />}
        description={`${activePercentage}% of total cases`}
        color="bg-green-50 dark:bg-green-900/20"
      />
      
      <StatCard
        title="Pending Cases"
        value={stats.pending}
        icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        color="bg-amber-50 dark:bg-amber-900/20"
      />
      
      <StatCard
        title="Closed Cases"
        value={stats.closed}
        icon={<CheckCircle className="h-5 w-5 text-indigo-500" />}
        description={`${closedPercentage}% completion rate`}
        color="bg-indigo-50 dark:bg-indigo-900/20"
      />
      
      <StatCard
        title="High Priority"
        value={stats.highPriority}
        icon={<Gauge className="h-5 w-5 text-red-500" />}
        color="bg-red-50 dark:bg-red-900/20"
      />
      
      <StatCard
        title="Deadlines This Week"
        value={stats.deadlinesThisWeek}
        icon={<Calendar className="h-5 w-5 text-purple-500" />}
        color="bg-purple-50 dark:bg-purple-900/20"
      />
    </div>
  );
};

export default CaseStatsCards;
