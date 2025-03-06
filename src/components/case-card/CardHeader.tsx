
import { Edit, MoreHorizontal, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CardHeaderProps {
  title: string;
  caseNumber: string;
  onEdit?: (e: React.MouseEvent) => void;
}

const CardHeader = ({ title, caseNumber, onEdit }: CardHeaderProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
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
  );
};

export default CardHeader;
