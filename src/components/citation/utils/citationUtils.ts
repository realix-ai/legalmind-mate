
import { Citation } from '@/services/citationService';

/**
 * Formats a citation according to the specified format
 */
export const formatCitationText = (
  citation: Citation,
  format: 'standard' | 'bluebook' | 'apa' | 'chicago'
): string => {
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

/**
 * Calculates the year range bounds based on citations
 */
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

/**
 * Filters citations based on court and year range
 */
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

/**
 * Extracts unique courts from citations
 */
export const getAvailableCourts = (citations: Citation[]): string[] => {
  const courts = new Set<string>();
  citations.forEach(citation => courts.add(citation.court));
  return Array.from(courts);
};
