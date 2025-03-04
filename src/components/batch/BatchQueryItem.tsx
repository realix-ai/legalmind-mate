
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BatchQuery } from './types';
import { getStatusInfo, getTypeLabel } from './utils';

interface BatchQueryItemProps {
  query: BatchQuery;
  isProcessing: boolean;
  onRemove: (id: string) => void;
}

const BatchQueryItem = ({ query, isProcessing, onRemove }: BatchQueryItemProps) => {
  return (
    <TableRow key={query.id} className="group hover:bg-slate-50/50">
      <TableCell>{getStatusInfo(query.status).icon}</TableCell>
      <TableCell className="font-medium">
        <div className="truncate max-w-[400px]">{query.text}</div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {getTypeLabel(query.type)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {query.status === 'pending' && !isProcessing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(query.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BatchQueryItem;
