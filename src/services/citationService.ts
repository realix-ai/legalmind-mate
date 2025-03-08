
// Citation database integration

export interface Citation {
  id: string;
  title: string;
  citation: string;
  year: number;
  court: string;
  url?: string;
  summary?: string;
}

// Mock database of legal citations
const mockCitations: Citation[] = [
  {
    id: 'smith-v-johnson-2018',
    title: 'Smith v. Johnson',
    citation: '567 U.S. 432',
    year: 2018,
    court: 'Supreme Court',
    url: 'https://example.com/smith-v-johnson',
    summary: 'Established the modern interpretation of reasonable doubt in contract disputes.'
  },
  {
    id: 'wilson-corp-v-davidson-2020',
    title: 'Wilson Corp v. Davidson',
    citation: '789 F.3d 123',
    year: 2020,
    court: 'Federal Circuit',
    url: 'https://example.com/wilson-corp-v-davidson',
    summary: 'Clarified the application of statutory requirements in corporate governance.'
  },
  {
    id: 'parker-trust-v-national-bank-2021',
    title: 'Parker Trust v. National Bank',
    citation: '234 F.Supp.2d 567',
    year: 2021,
    court: 'Southern District of New York',
    url: 'https://example.com/parker-trust-v-national-bank',
    summary: 'Set important boundaries for fiduciary responsibility in trust management.'
  },
  {
    id: 'johnson-v-metropolitan-2019',
    title: 'Johnson v. Metropolitan',
    citation: '456 F.3d 789',
    year: 2019,
    court: 'Ninth Circuit',
    url: 'https://example.com/johnson-v-metropolitan',
    summary: 'Addressed issues of standing in class action lawsuits.'
  },
  {
    id: 'pearson-v-callahan-2009',
    title: 'Pearson v. Callahan',
    citation: '555 U.S. 223',
    year: 2009,
    court: 'Supreme Court',
    url: 'https://example.com/pearson-v-callahan',
    summary: 'Modified the Saucier protocol for qualified immunity, allowing courts discretion in deciding which prong to address first.'
  },
  {
    id: 'saucier-v-katz-2001',
    title: 'Saucier v. Katz',
    citation: '533 U.S. 194',
    year: 2001,
    court: 'Supreme Court',
    url: 'https://example.com/saucier-v-katz',
    summary: 'Established a two-part test for qualified immunity analysis in excessive force claims.'
  },
  {
    id: 'taylor-v-riojas-2020',
    title: 'Taylor v. Riojas',
    citation: '141 S. Ct. 52',
    year: 2020,
    court: 'Supreme Court',
    url: 'https://example.com/taylor-v-riojas',
    summary: "Addressed qualified immunity where officials' conduct was obviously unconstitutional even without a prior case with identical facts."
  },
  // Additional citations with different courts and years for better filtering
  {
    id: 'doe-v-university-2022',
    title: 'Doe v. University',
    citation: '234 F.3d 567',
    year: 2022,
    court: 'Third Circuit',
    url: 'https://example.com/doe-v-university',
    summary: 'Established new standards for due process in university disciplinary proceedings.'
  },
  {
    id: 'city-of-chicago-v-environmental-group-2015',
    title: 'City of Chicago v. Environmental Group',
    citation: '789 Ill. 2d 345',
    year: 2015,
    court: 'Illinois Supreme Court',
    url: 'https://example.com/chicago-v-environmental',
    summary: 'Key case on municipal liability in environmental regulation enforcement.'
  },
  {
    id: 'tech-industries-v-patent-holder-2019',
    title: 'Tech Industries v. Patent Holder',
    citation: '345 F.Supp.3d 678',
    year: 2019,
    court: 'District of Delaware',
    url: 'https://example.com/tech-v-patent',
    summary: 'Important case on software patent enforcement and fair use defenses.'
  }
];

// Search citations based on keywords
export const searchCitations = (query: string): Citation[] => {
  // If the query is empty, return a few recent citations as default
  if (!query.trim()) {
    return mockCitations.slice(0, 3);
  }
  
  const normalizedQuery = query.toLowerCase();
  
  // Split the query into individual words for better matching
  const queryWords = normalizedQuery.split(/\s+/).filter(word => 
    // Filter out common words that aren't useful for searching
    !['the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'a', 'an'].includes(word) && 
    word.length > 2
  );
  
  // If we don't have any useful words after filtering, return some default citations
  if (queryWords.length === 0) {
    return mockCitations.slice(0, 3);
  }
  
  const matches = mockCitations.filter(citation => {
    const titleLower = citation.title.toLowerCase();
    const summaryLower = citation.summary?.toLowerCase() || '';
    const courtLower = citation.court.toLowerCase();
    
    // Check if any of the query words appear in the citation fields
    return queryWords.some(word => 
      titleLower.includes(word) || 
      summaryLower.includes(word) || 
      courtLower.includes(word)
    );
  });
  
  // If no matches found, return a few default citations rather than empty array
  return matches.length > 0 ? matches : mockCitations.slice(0, 3);
};

// Get citation by ID
export const getCitationById = (id: string): Citation | undefined => {
  return mockCitations.find(citation => citation.id === id);
};

// Get all available courts for filtering
export const getAvailableCourts = (): string[] => {
  const courts = new Set<string>();
  mockCitations.forEach(citation => courts.add(citation.court));
  return Array.from(courts);
};

// Get year range (min and max years) for filtering
export const getCitationYearRange = (): [number, number] => {
  if (mockCitations.length === 0) return [1950, new Date().getFullYear()];
  
  let minYear = mockCitations[0].year;
  let maxYear = mockCitations[0].year;
  
  mockCitations.forEach(citation => {
    if (citation.year < minYear) minYear = citation.year;
    if (citation.year > maxYear) maxYear = citation.year;
  });
  
  return [minYear, maxYear];
};

// In a real application, this would fetch data from an actual citation API
export const fetchRelatedCitations = async (query: string): Promise<Citation[]> => {
  console.log('CitationService: Fetching citations related to:', query);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Search mock database
  return searchCitations(query);
};

// Filter citations based on criteria
export const filterCitations = (
  citations: Citation[],
  filters: {
    court?: string;
    yearRange?: [number, number];
    searchTerm?: string;
  }
): Citation[] => {
  return citations.filter(citation => {
    // Apply court filter
    if (filters.court && citation.court !== filters.court) {
      return false;
    }
    
    // Apply year range filter
    if (filters.yearRange && (citation.year < filters.yearRange[0] || citation.year > filters.yearRange[1])) {
      return false;
    }
    
    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        citation.title.toLowerCase().includes(searchLower) ||
        citation.citation.toLowerCase().includes(searchLower) ||
        citation.court.toLowerCase().includes(searchLower) ||
        (citation.summary && citation.summary.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
};
