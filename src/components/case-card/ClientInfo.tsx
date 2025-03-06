
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useState } from 'react';

interface ClientInfoProps {
  clientName: string;
  date: string;
  deadline?: Date;
  onUpdateDeadline?: (deadline: Date | undefined) => void;
}

const ClientInfo = ({ clientName, date, deadline, onUpdateDeadline }: ClientInfoProps) => {
  const [isDeadlinePopoverOpen, setIsDeadlinePopoverOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(deadline);

  const handleDeadlineChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onUpdateDeadline && date) {
      onUpdateDeadline(date);
      setIsDeadlinePopoverOpen(false);
      toast.success(`Deadline updated to ${format(date, 'PPP')}`);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{clientName}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Popover open={isDeadlinePopoverOpen} onOpenChange={setIsDeadlinePopoverOpen}>
          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Calendar className="h-4 w-4" />
              <span>{deadline ? format(deadline, 'PPP') : date}</span>
            </button>
          </PopoverTrigger>
          {onUpdateDeadline && (
            <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDeadlineChange}
                initialFocus
              />
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default ClientInfo;
