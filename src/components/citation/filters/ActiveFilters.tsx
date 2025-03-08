
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActiveFiltersProps {
  courtFilter: string | null;
  yearRange: [number, number];
  yearBounds: [number, number];
  onResetCourtFilter: () => void;
  onResetYearRange: () => void;
}

export const ActiveFilters = ({
  courtFilter,
  yearRange,
  yearBounds,
  onResetCourtFilter,
  onResetYearRange
}: ActiveFiltersProps) => {
  if (!courtFilter && yearRange[0] === yearBounds[0] && yearRange[1] === yearBounds[1]) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {courtFilter && (
        <Badge variant="outline" className="text-xs py-0 h-5">
          {courtFilter}
          <Button 
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={onResetCourtFilter}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      )}
      
      {(yearRange[0] !== yearBounds[0] || yearRange[1] !== yearBounds[1]) && (
        <Badge variant="outline" className="text-xs py-0 h-5">
          {yearRange[0]} - {yearRange[1]}
          <Button 
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={onResetYearRange}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      )}
    </div>
  );
};
