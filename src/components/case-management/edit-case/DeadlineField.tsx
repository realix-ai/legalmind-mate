
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

interface DeadlineFieldProps {
  editCaseDeadline: Date | undefined;
  setEditCaseDeadline: (deadline: Date | undefined) => void;
}

const DeadlineField = ({ editCaseDeadline, setEditCaseDeadline }: DeadlineFieldProps) => {
  // Fix: Add a click handler to stop propagation and prevent the dialog from closing
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      console.log("Selected date:", date);
      setEditCaseDeadline(date);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to parent elements
    e.stopPropagation();
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="editCaseDeadline" className="text-right">
        Deadline
      </Label>
      <div className="col-span-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="editCaseDeadline"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !editCaseDeadline && "text-muted-foreground"
              )}
              onClick={handleButtonClick}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {editCaseDeadline ? (
                format(editCaseDeadline, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
            <Calendar
              mode="single"
              selected={editCaseDeadline}
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DeadlineField;
