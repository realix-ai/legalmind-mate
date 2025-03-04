
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatchInputForm from './BatchInputForm';
import { BatchQuery } from './types';

interface BatchHeaderProps {
  onAddQuery: (query: BatchQuery) => void;
  isProcessing: boolean;
}

const BatchHeader = ({ onAddQuery, isProcessing }: BatchHeaderProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b">
        <CardTitle className="text-xl">Add Queries to Batch</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <BatchInputForm onAddQuery={onAddQuery} isProcessing={isProcessing} />
      </CardContent>
    </Card>
  );
};

export default BatchHeader;
