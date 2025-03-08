
import { BookOpen } from 'lucide-react';
import CitationFormatSelector from './CitationFormatSelector';
import CitationFilters from './CitationFilters';
import { Citation } from '@/services/citationService';

type CitationFormat = 'standard' | 'bluebook' | 'apa' | 'chicago';

interface CitationHeaderProps {
  citations: Citation[];
  citationFormat: CitationFormat;
  courtFilter: string | null;
  yearRange: [number, number];
  yearBounds: [number, number];
  onFormatChange: (format: CitationFormat) => void;
  onCourtFilterChange: (court: string | null) => void;
  onYearRangeChange: (range: [number, number]) => void;
  onResetFilters: () => void;
}

const CitationHeader = ({
  citations,
  citationFormat,
  courtFilter,
  yearRange,
  yearBounds,
  onFormatChange,
  onCourtFilterChange,
  onYearRangeChange,
  onResetFilters
}: CitationHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Related Legal Citations</h3>
      </div>
      <div className="flex items-center gap-2">
        <CitationFormatSelector 
          value={citationFormat}
          onChange={onFormatChange}
        />
        <CitationFilters
          citations={citations}
          courtFilter={courtFilter}
          yearRange={yearRange}
          yearBounds={yearBounds}
          onCourtFilterChange={onCourtFilterChange}
          onYearRangeChange={onYearRangeChange}
          onReset={onResetFilters}
        />
      </div>
    </div>
  );
};

export default CitationHeader;
