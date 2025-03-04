
import { Button } from '@/components/ui/button';
import { PlayCircle, Trash2 } from 'lucide-react';

interface BatchQueueActionsProps {
  isProcessing: boolean;
  hasQueries: boolean;
  onProcess: () => void;
  onReset: () => void;
}

const BatchQueueActions = ({ isProcessing, hasQueries, onProcess, onReset }: BatchQueueActionsProps) => {
  return (
    <div className="flex justify-between pt-2">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={isProcessing || !hasQueries}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear All
      </Button>
      
      <Button
        onClick={onProcess}
        disabled={isProcessing || !hasQueries}
        className="gap-2"
      >
        <PlayCircle className="h-4 w-4" />
        Process Batch
      </Button>
    </div>
  );
};

export default BatchQueueActions;
