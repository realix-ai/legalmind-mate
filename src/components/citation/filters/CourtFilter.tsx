
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourtFilterProps {
  courtFilter: string | null;
  availableCourts: string[];
  onCourtChange: (value: string) => void;
}

export const CourtFilter = ({ 
  courtFilter, 
  availableCourts, 
  onCourtChange 
}: CourtFilterProps) => {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium">Court</span>
      </div>
      <Select 
        value={courtFilter === null ? "_all" : courtFilter}
        onValueChange={onCourtChange}
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
  );
};
