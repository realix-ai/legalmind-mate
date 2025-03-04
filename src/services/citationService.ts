
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
  }
];

// Search citations based on keywords
export const searchCitations = (query: string): Citation[] => {
  const normalizedQuery = query.toLowerCase();
  return mockCitations.filter(citation => 
    citation.title.toLowerCase().includes(normalizedQuery) ||
    citation.summary?.toLowerCase().includes(normalizedQuery) ||
    citation.court.toLowerCase().includes(normalizedQuery)
  );
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
