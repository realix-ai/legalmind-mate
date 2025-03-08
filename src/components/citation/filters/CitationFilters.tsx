
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CourtFilter } from './CourtFilter';
import { YearRangeFilter } from './YearRangeFilter';
import { ActiveFilters } from './ActiveFilters';

interface CitationFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  courtFilter: string | null;
  setCourtFilter: (court: string | null) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  yearBounds: [number, number];
  availableCourts: string[];
}

export const CitationFilters = ({
  showFilters,
  setShowFilters,
  courtFilter,
  setCourtFilter,
  yearRange,
  setYearRange,
  yearBounds,
  availableCourts
}: CitationFiltersProps) => {
  const resetFilters = () => {
    setCourtFilter(null);
    setYearRange(yearBounds as [number, number]);
  };

  const handleCourtChange = (value: string) => {
    setCourtFilter(value === "_all" ? null : value);
  };

  return (
    <Collapsible open={showFilters} onOpenChange={setShowFilters}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
        >
          <Filter className="h-3 w-3 mr-1" />
          Filter
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-2 mb-3 bg-background rounded-md border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium">Filter Citations</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs"
              onClick={resetFilters}
            >
              <X className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-3">
            <CourtFilter 
              courtFilter={courtFilter} 
              availableCourts={availableCourts} 
              onCourtChange={handleCourtChange} 
            />
            
            <YearRangeFilter 
              yearRange={yearRange} 
              yearBounds={yearBounds}
              onYearRangeChange={setYearRange} 
            />
          </div>
          
          <ActiveFilters 
            courtFilter={courtFilter}
            yearRange={yearRange}
            yearBounds={yearBounds}
            onResetCourtFilter={() => setCourtFilter(null)}
            onResetYearRange={() => setYearRange(yearBounds as [number, number])}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
