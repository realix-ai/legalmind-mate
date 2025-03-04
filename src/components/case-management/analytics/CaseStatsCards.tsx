
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { CaseStatistics } from '@/hooks/case-management/useCaseManagement';

interface CaseStatsCardsProps {
  statistics: CaseStatistics;
}

const CaseStatsCards: React.FC<CaseStatsCardsProps> = ({ statistics }) => {
  const cards = [
    {
      title: 'Total Cases',
      value: statistics.totalCases,
      icon: Users,
      color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Active Cases',
      value: statistics.activeCases,
      icon: Clock,
      color: 'text-green-500 bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Pending Cases',
      value: statistics.pendingCases,
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/20',
    },
    {
      title: 'Completed Cases',
      value: statistics.closedCases,
      icon: CheckCircle,
      color: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-full ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CaseStatsCards;
