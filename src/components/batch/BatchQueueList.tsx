
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BatchQuery } from './types';
import BatchQueryItem from './BatchQueryItem';

interface BatchQueueListProps {
  queries: BatchQuery[];
  isProcessing: boolean;
  onRemoveQuery: (id: string) => void;
}

const BatchQueueList = ({ queries, isProcessing, onRemoveQuery }: BatchQueueListProps) => {
  if (queries.length === 0) {
    return (
      <div className="text-center py-10 px-4 border border-dashed rounded-md bg-slate-50/50">
        <p className="text-muted-foreground">No queries in the batch. Add some queries above.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-slate-50/80 sticky top-0">
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Query</TableHead>
              <TableHead className="w-32">Type</TableHead>
              <TableHead className="w-12 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <BatchQueryItem
                key={query.id}
                query={query}
                isProcessing={isProcessing}
                onRemove={onRemoveQuery}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BatchQueueList;
