
import { Citation } from '@/services/citationService';

// Format a citation based on the selected format
export const formatCitation = (
  citation: Citation, 
  format: 'standard' | 'bluebook' | 'apa' | 'chicago'
) => {
  switch (format) {
    case 'bluebook':
      return `${citation.title}, ${citation.citation} (${citation.court}, ${citation.year})`;
    case 'apa':
      return `${citation.title}. (${citation.year}). ${citation.citation}. ${citation.court}.`;
    case 'chicago':
      return `${citation.title}, ${citation.citation}, ${citation.court} ${citation.year}.`;
    default:
      return `${citation.title}, ${citation.citation} (${citation.court}, ${citation.year})`;
  }
};

// Filter citations based on selected filters
export const filterCitations = (
  citations: Citation[],
  courtFilter: string | null,
  yearRange: [number, number]
): Citation[] => {
  return citations.filter(citation => {
    // Apply court filter
    if (courtFilter && citation.court !== courtFilter) {
      return false;
    }
    
    // Apply year range filter
    if (citation.year < yearRange[0] || citation.year > yearRange[1]) {
      return false;
    }
    
    return true;
  });
};

// Get unique courts from citation data
export const getAvailableCourts = (citations: Citation[]): string[] => {
  const courts = new Set<string>();
  citations.forEach(citation => courts.add(citation.court));
  return Array.from(courts);
};

// Calculate the year bounds for the slider
export const calculateYearBounds = (citations: Citation[]): [number, number] => {
  const currentYear = new Date().getFullYear();
  
  if (citations.length === 0) return [1950, currentYear];
  
  let minYear = citations[0].year;
  let maxYear = citations[0].year;
  
  citations.forEach(citation => {
    if (citation.year < minYear) minYear = citation.year;
    if (citation.year > maxYear) maxYear = citation.year;
  });
  
  // Always make sure current year is included in the range
  maxYear = Math.max(maxYear, currentYear);
  
  return [minYear, maxYear];
};
