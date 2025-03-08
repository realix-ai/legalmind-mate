
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

// In a real application, this would fetch data from an actual citation API
export const fetchRelatedCitations = async (query: string): Promise<Citation[]> => {
  console.log('CitationService: Fetching citations related to:', query);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Search mock database
  return searchCitations(query);
};

