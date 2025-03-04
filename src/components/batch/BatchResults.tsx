
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BatchQuery } from './types';
import { getStatusInfo } from './utils';

interface BatchResultsProps {
  queries: BatchQuery[];
}

const BatchResults = ({ queries }: BatchResultsProps) => {
  const completedQueries = queries.filter(q => q.status === 'completed');
  
  if (completedQueries.length === 0) {
    return null;
  }
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b">
        <CardTitle className="text-xl">Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {completedQueries.map((query) => (
            <div key={`result-${query.id}`} className="border rounded-md p-4 bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{query.text}</h3>
                {getStatusInfo(query.status).badge}
              </div>
              <Separator className="my-2" />
              <p className="text-sm">{query.result}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchResults;
