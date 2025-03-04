
import { Progress } from '@/components/ui/progress';

interface BatchProgressIndicatorProps {
  progress: number;
  isProcessing: boolean;
}

const BatchProgressIndicator = ({ progress, isProcessing }: BatchProgressIndicatorProps) => {
  if (!isProcessing) {
    return null;
  }
  
  return (
    <div className="space-y-2 p-3 border rounded-md bg-slate-50/50">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Processing batch...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default BatchProgressIndicator;
