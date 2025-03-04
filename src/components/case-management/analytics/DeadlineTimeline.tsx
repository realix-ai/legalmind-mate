
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Case as CaseType } from '@/utils/documents';
import { CalendarIcon, AlertTriangle } from 'lucide-react';

interface DeadlineTimelineProps {
  upcomingDeadlines: CaseType[];
}

const DeadlineTimeline = ({ upcomingDeadlines }: DeadlineTimelineProps) => {
  const now = Date.now();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingDeadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <CalendarIcon className="h-8 w-8 mb-2 opacity-40" />
            <p>No upcoming deadlines</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingDeadlines.map(caseItem => {
              const deadline = caseItem.deadline || 0;
              const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
              const isUrgent = daysRemaining <= 3;
              
              return (
                <div 
                  key={caseItem.id}
                  className={`p-3 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50' : 'border-blue-100 bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{caseItem.name}</h4>
                      <p className="text-sm">{format(deadline, 'PPP')}</p>
                    </div>
                    {isUrgent && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs">
                    {daysRemaining === 0 ? (
                      <span className="font-bold text-red-600">Due today!</span>
                    ) : daysRemaining === 1 ? (
                      <span className="font-bold text-red-500">Due tomorrow</span>
                    ) : (
                      <span className={isUrgent ? 'text-red-500' : ''}>
                        {daysRemaining} days remaining
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeadlineTimeline;
