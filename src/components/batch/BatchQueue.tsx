
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BatchQuery } from './types';
import BatchQueueList from './BatchQueueList';
import BatchProgressIndicator from './BatchProgressIndicator';
import BatchQueueActions from './BatchQueueActions';

interface BatchQueueProps {
  queries: BatchQuery[];
  isProcessing: boolean;
  progress: number;
  onRemoveQuery: (id: string) => void;
  onProcess: () => void;
  onReset: () => void;
}

const BatchQueue = ({ 
  queries, 
  isProcessing, 
  progress, 
  onRemoveQuery, 
  onProcess, 
  onReset 
}: BatchQueueProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Batch Queue</CardTitle>
        <Badge variant="outline" className="ml-2 text-sm font-normal">
          {queries.length} {queries.length === 1 ? 'query' : 'queries'}
        </Badge>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <BatchQueueList 
            queries={queries} 
            isProcessing={isProcessing} 
            onRemoveQuery={onRemoveQuery} 
          />
          
          <BatchProgressIndicator 
            progress={progress} 
            isProcessing={isProcessing} 
          />
          
          <BatchQueueActions 
            isProcessing={isProcessing} 
            hasQueries={queries.length > 0} 
            onProcess={onProcess} 
            onReset={onReset} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchQueue;
