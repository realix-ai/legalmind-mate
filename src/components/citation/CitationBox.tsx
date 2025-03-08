
import { useState, useMemo } from 'react';
import { Citation } from '@/services/citationService';
import { cn } from '@/lib/utils';
import CitationHeader from './CitationHeader';
import CitationList from './CitationList';
import { filterCitations, calculateYearBounds } from './citationUtils';

interface CitationBoxProps {
  citations: Citation[];
  className?: string;
  maxInitialDisplay?: number;
}

const CitationBox = ({ 
  citations, 
  className,
  maxInitialDisplay = 2 
}: CitationBoxProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Filter states
  const [courtFilter, setCourtFilter] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<'standard' | 'bluebook' | 'apa' | 'chicago'>('standard');
  
  // Calculate year bounds for slider
  const yearBounds = useMemo(() => {
    return calculateYearBounds(citations);
  }, [citations]);
  
  // Year range state
  const [yearRange, setYearRange] = useState<[number, number]>(yearBounds);
  
  // Update year range when bounds change
  useMemo(() => {
    setYearRange(yearBounds);
  }, [yearBounds]);
  
  if (citations.length === 0) {
    return null;
  }
  
  // Apply filters
  const filteredCitations = filterCitations(citations, courtFilter, yearRange);
  
  // Handle expanded/collapsed view
  const displayCitations = expanded ? filteredCitations : filteredCitations.slice(0, maxInitialDisplay);
  
  // Reset filters
  const resetFilters = () => {
    setCourtFilter(null);
    setYearRange(yearBounds);
  };
  
  return (
    <div className={cn(
      "mt-6 border rounded-lg p-4 bg-muted/30 shadow-sm",
      className
    )}>
      <CitationHeader 
        citations={citations}
        citationFormat={citationFormat}
        courtFilter={courtFilter}
        yearRange={yearRange}
        yearBounds={yearBounds}
        onFormatChange={setCitationFormat}
        onCourtFilterChange={setCourtFilter}
        onYearRangeChange={setYearRange}
        onResetFilters={resetFilters}
      />
      
      <CitationList 
        citations={filteredCitations}
        displayCitations={displayCitations}
        format={citationFormat}
        expanded={expanded}
        maxInitialDisplay={maxInitialDisplay}
        onExpandToggle={() => setExpanded(!expanded)}
      />
    </div>
  );
};

export default CitationBox;
