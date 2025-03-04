
import { cn } from '@/lib/utils';
import { Calendar, Clock, Users, MoreHorizontal, Star, Edit, Check, X, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CaseCardProps {
  title: string;
  caseNumber: string;
  clientName: string;
  date: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  notes?: string;
  deadline?: Date;
  onUpdateStatus?: (status: 'active' | 'closed' | 'pending') => void;
  onUpdatePriority?: (priority: 'high' | 'medium' | 'low') => void;
  onUpdateDeadline?: (deadline: Date | undefined) => void;
  onUpdateNotes?: (notes: string) => void;
}

const CaseCard = ({
  title,
  caseNumber,
  clientName,
  date,
  status,
  priority,
  onClick,
  onEdit,
  notes = '',
  deadline,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateDeadline,
  onUpdateNotes
}: CaseCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = useState(false);
  const [isDeadlinePopoverOpen, setIsDeadlinePopoverOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(deadline);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'closed':
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

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

  const handleDeadlineChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onUpdateDeadline && date) {
      onUpdateDeadline(date);
      setIsDeadlinePopoverOpen(false);
      toast.success(`Deadline updated to ${format(date, 'PPP')}`);
    }
  };

  const handleNotesChange = () => {
    if (onUpdateNotes) {
      onUpdateNotes(editedNotes);
      setIsEditingNotes(false);
      toast.success("Notes updated");
    }
  };

  const handleCancelNotesEdit = () => {
    setEditedNotes(notes);
    setIsEditingNotes(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger the card click if we're not interacting with one of the editing controls
    if (
      !isEditingNotes && 
      !isStatusPopoverOpen && 
      !isPriorityPopoverOpen && 
      !isDeadlinePopoverOpen
    ) {
      onClick();
    }
  };

  return (
    <div 
      className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-subtle hover:border-primary/30 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{caseNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isFavorite ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "text-muted-foreground hover:bg-muted"
              )}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            {onEdit && (
              <button 
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                onClick={onEdit}
                aria-label="Edit case"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            <button 
              className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        
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
                  <div className="p-3">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDeadlineChange}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>
        
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

        {/* Notes section */}
        {(notes || onUpdateNotes) && (
          <div className="mt-4 border-t pt-3">
            {isEditingNotes ? (
              <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2">
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="text-sm min-h-[60px]"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancelNotesEdit}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleNotesChange}
                    className="h-8 px-2"
                  >
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="text-sm text-muted-foreground cursor-text"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpdateNotes) setIsEditingNotes(true);
                }}
              >
                {notes ? notes : "Add notes..."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseCard;
