
import { cn } from '@/lib/utils';
import { Calendar, Clock, Users, MoreHorizontal, Star, Edit } from 'lucide-react';
import { useState } from 'react';

interface CaseCardProps {
  title: string;
  caseNumber: string;
  clientName: string;
  date: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}

const CaseCard = ({
  title,
  caseNumber,
  clientName,
  date,
  status,
  priority,
  onClick,
  onEdit
}: CaseCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
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

  return (
    <div 
      className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-subtle hover:border-primary/30 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">Case #{caseNumber}</p>
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
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className={cn(
            "text-xs font-medium py-1 px-2.5 rounded-full",
            getStatusColor(status)
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          
          <span className={cn(
            "text-xs font-medium py-1 px-2.5 rounded-full",
            getPriorityColor(priority)
          )}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
