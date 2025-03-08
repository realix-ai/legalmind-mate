
import { useState, useMemo } from 'react';
import { X, Filter, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Citation } from '@/services/citationService';
import { getAvailableCourts } from './citationUtils';

interface CitationFiltersProps {
  citations: Citation[];
  courtFilter: string | null;
  yearRange: [number, number];
  yearBounds: [number, number];
  onCourtFilterChange: (court: string | null) => void;
  onYearRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

const CitationFilters = ({
  citations,
  courtFilter,
  yearRange,
  yearBounds,
  onCourtFilterChange,
  onYearRangeChange,
  onReset
}: CitationFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique courts for filter dropdown
  const availableCourts = useMemo(() => {
    return getAvailableCourts(citations);
  }, [citations]);
  
  // Handle court selection
  const handleCourtChange = (value: string) => {
    onCourtFilterChange(value === "_all" ? null : value);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 text-xs"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="h-3 w-3 mr-1" />
        Filter
      </Button>
      
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <div className="p-2 mb-3 bg-background rounded-md border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium">Filter Citations</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={onReset}
              >
                <X className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Court</span>
                </div>
                <Select 
                  value={courtFilter === null ? "_all" : courtFilter}
                  onValueChange={handleCourtChange}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="All Courts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">All Courts</SelectItem>
                    {availableCourts.map(court => (
                      <SelectItem key={court} value={court}>{court}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Year Range: {yearRange[0]} - {yearRange[1]}</span>
                </div>
                <Slider
                  min={yearBounds[0]}
                  max={yearBounds[1]}
                  step={1}
                  value={yearRange}
                  onValueChange={(value) => onYearRangeChange(value as [number, number])}
                  className="my-2"
                />
              </div>
            </div>
            
            {/* Display active filters */}
            <div className="flex flex-wrap gap-1">
              {courtFilter && (
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {courtFilter}
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => onCourtFilterChange(null)}
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
                    onClick={() => onYearRangeChange(yearBounds)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CitationFilters;
