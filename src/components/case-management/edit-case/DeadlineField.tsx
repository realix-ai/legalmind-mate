
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeadlineFieldProps {
  editCaseDeadline: Date | undefined;
  setEditCaseDeadline: (deadline: Date | undefined) => void;
}

const DeadlineField = ({ editCaseDeadline, setEditCaseDeadline }: DeadlineFieldProps) => {
  // Reference to prevent bubbling
  const calendarRef = React.useRef<HTMLDivElement>(null);
  
  const handleSelect = (date: Date | undefined) => {
    setEditCaseDeadline(date);
    // No need to manually close anything - the Calendar component will handle this
  };
  
  // This ensures the event stays contained within our component and dialog remains open
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="deadline" className="text-right">
        Deadline
      </Label>
      <div className="col-span-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="deadline"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editCaseDeadline && "text-muted-foreground"
                    )}
                    onClick={stopPropagation}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editCaseDeadline ? (
                      format(editCaseDeadline, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div 
                    ref={calendarRef} 
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation}
                    className="calendar-container"
                  >
                    <Calendar
                      mode="single"
                      selected={editCaseDeadline}
                      onSelect={handleSelect}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select a deadline date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default DeadlineField;
