
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getStatusColor, getPriorityColor } from './card-utils';

interface StatusPrioritySelectorProps {
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  onUpdateStatus?: (status: 'active' | 'closed' | 'pending') => void;
  onUpdatePriority?: (priority: 'high' | 'medium' | 'low') => void;
}

const StatusPrioritySelector = ({ 
  status, 
  priority, 
  onUpdateStatus, 
  onUpdatePriority 
}: StatusPrioritySelectorProps) => {
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = useState(false);
  
  const handleStatusChange = (newStatus: 'active' | 'closed' | 'pending') => {
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
      setIsStatusPopoverOpen(false);
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const handlePriorityChange = (newPriority: 'high' | 'medium' | 'low') => {
    if (onUpdatePriority) {
      onUpdatePriority(newPriority);
      setIsPriorityPopoverOpen(false);
      toast.success(`Priority updated to ${newPriority}`);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className={cn(
            "text-xs font-medium py-1 px-2.5 rounded-full",
            getStatusColor(status)
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        </PopoverTrigger>
        {onUpdateStatus && (
          <PopoverContent className="w-32 p-1" align="start" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-1">
              {['active', 'pending', 'closed'].map((statusOption) => (
                <button
                  key={statusOption}
                  className={cn(
                    "text-xs font-medium py-1.5 px-3 rounded text-left hover:bg-muted",
                    status === statusOption ? "bg-muted" : ""
                  )}
                  onClick={() => handleStatusChange(statusOption as 'active' | 'pending' | 'closed')}
                >
                  {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                </button>
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
      
      <Popover open={isPriorityPopoverOpen} onOpenChange={setIsPriorityPopoverOpen}>
        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className={cn(
            "text-xs font-medium py-1 px-2.5 rounded-full",
            getPriorityColor(priority)
          )}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </button>
        </PopoverTrigger>
        {onUpdatePriority && (
          <PopoverContent className="w-32 p-1" align="end" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-1">
              {['high', 'medium', 'low'].map((priorityOption) => (
                <button
                  key={priorityOption}
                  className={cn(
                    "text-xs font-medium py-1.5 px-3 rounded text-left hover:bg-muted",
                    priority === priorityOption ? "bg-muted" : ""
                  )}
                  onClick={() => handlePriorityChange(priorityOption as 'high' | 'medium' | 'low')}
                >
                  {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
                </button>
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};

export default StatusPrioritySelector;
