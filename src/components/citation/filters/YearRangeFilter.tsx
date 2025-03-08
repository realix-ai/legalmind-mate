
import { Calendar } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface YearRangeFilterProps {
  yearRange: [number, number];
  yearBounds: [number, number];
  onYearRangeChange: (value: [number, number]) => void;
}

export const YearRangeFilter = ({ 
  yearRange, 
  yearBounds,
  onYearRangeChange 
}: YearRangeFilterProps) => {
  return (
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
  );
};
