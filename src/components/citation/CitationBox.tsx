
import { useState, useMemo } from 'react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Citation } from '@/services/citationService';
import { CitationHeader } from './CitationHeader';
import { CitationFilters } from './filters/CitationFilters';
import { CitationList } from './display/CitationList';
import { 
  calculateYearBounds, 
  filterCitations, 
  formatCitationText,
  getAvailableCourts
} from './utils/citationUtils';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [courtFilter, setCourtFilter] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([1950, new Date().getFullYear()]);
  
  // Citation display format
  const [citationFormat, setCitationFormat] = useState<'standard' | 'bluebook' | 'apa' | 'chicago'>('standard');
  
  if (citations.length === 0) {
    return null;
  }
  
  // Get unique courts for filter dropdown
  const availableCourts = useMemo(() => 
    getAvailableCourts(citations), 
    [citations]
  );
  
  // Get year range for slider - modified to always include current year
  const yearBounds = useMemo(() => 
    calculateYearBounds(citations), 
    [citations]
  );
  
  // Apply filters
  const filteredCitations = useMemo(() => 
    filterCitations(citations, courtFilter, yearRange),
    [citations, courtFilter, yearRange]
  );
  
  const displayCitations = expanded 
    ? filteredCitations 
    : filteredCitations.slice(0, maxInitialDisplay);
  
  const handleCopyCitation = (citation: Citation) => {
    const citationText = formatCitationText(citation, citationFormat);
    
    navigator.clipboard.writeText(citationText);
    setCopiedId(citation.id);
    toast.success("Citation copied to clipboard");
    
    // Reset copied state after a short delay
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  return (
    <div className={cn(
      "mt-6 border rounded-lg p-4 bg-muted/30 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <CitationHeader 
          citationFormat={citationFormat}
          onFormatChange={setCitationFormat}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        
        <CitationFilters 
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          courtFilter={courtFilter}
          setCourtFilter={setCourtFilter}
          yearRange={yearRange}
          setYearRange={setYearRange}
          yearBounds={yearBounds}
          availableCourts={availableCourts}
        />
      </div>
      
      <CitationList 
        displayCitations={displayCitations}
        filteredCitations={filteredCitations}
        expanded={expanded}
        setExpanded={setExpanded}
        maxInitialDisplay={maxInitialDisplay}
        onCopyCitation={handleCopyCitation}
        copiedId={copiedId}
        citationFormat={citationFormat}
      />
    </div>
  );
};

export default CitationBox;
