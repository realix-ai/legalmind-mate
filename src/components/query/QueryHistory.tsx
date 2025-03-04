
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface QueryHistoryProps {
  history: Array<{
    id: string;
    text: string;
    timestamp: number;
  }>;
  onSelectQuery: (queryText: string) => void;
  onClearHistory: () => void;
}

const QueryHistory = ({ history, onSelectQuery, onClearHistory }: QueryHistoryProps) => {
  return (
    <div className="p-3 border rounded-md shadow-sm bg-background">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Recent Queries</h3>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 p-1" 
            onClick={onClearHistory}
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        )}
      </div>
      
      {history.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">No recent queries</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto space-y-1">
          {history.map(item => (
            <li 
              key={item.id}
              className="text-xs p-2 hover:bg-accent rounded cursor-pointer"
              onClick={() => onSelectQuery(item.text)}
            >
              <div className="truncate">{item.text}</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QueryHistory;
