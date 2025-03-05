
import { RefObject } from 'react';
import QueryHistory from '@/components/query/QueryHistory';

interface QueryHistoryViewProps {
  showHistory: boolean;
  historyRef: RefObject<HTMLDivElement>;
  queryHistory: Array<{
    id: string;
    text: string;
    timestamp: number;
  }>;
  onSelectQuery: (historyText: string) => void;
  clearHistory: () => void;
}

const QueryHistoryView = ({
  showHistory,
  historyRef,
  queryHistory,
  onSelectQuery,
  clearHistory
}: QueryHistoryViewProps) => {
  if (!showHistory) {
    return null;
  }
  
  return (
    <div 
      ref={historyRef}
      className="relative z-10 w-72 shadow-md mb-4"
    >
      <QueryHistory 
        history={queryHistory} 
        onSelectQuery={onSelectQuery} 
        onClearHistory={clearHistory}
      />
    </div>
  );
};

export default QueryHistoryView;
