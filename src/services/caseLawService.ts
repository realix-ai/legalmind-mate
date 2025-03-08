
import { useQuery } from '@tanstack/react-query';

interface CaseLawCase {
  id: string;
  name: string;
  citation: string;
  year: number;
  court: string;
  summary: string;
  fullText?: string;
}

// Mock API for case law search (would be replaced with a real API)
const mockCases: CaseLawCase[] = [
  {
    id: 'c1',
    name: 'Brown v. Board of Education',
    citation: '347 U.S. 483',
    year: 1954,
    court: 'Supreme Court of the United States',
    summary: 'Landmark decision that declared state laws establishing separate public schools for black and white students to be unconstitutional.'
  },
  {
    id: 'c2',
    name: 'Roe v. Wade',
    citation: '410 U.S. 113',
    year: 1973,
    court: 'Supreme Court of the United States',
    summary: 'Landmark decision that recognized that the right to privacy under the Due Process Clause of the 14th Amendment extends to a woman\'s decision to have an abortion.'
  },
  {
    id: 'c3',
    name: 'Miranda v. Arizona',
    citation: '384 U.S. 436',
    year: 1966,
    court: 'Supreme Court of the United States',
    summary: 'Landmark decision that established that prior to police interrogation, a person in police custody must be informed of their right to remain silent and right to consult with an attorney.'
  },
  {
    id: 'c4',
    name: 'Obergefell v. Hodges',
    citation: '576 U.S. 644',
    year: 2015,
    court: 'Supreme Court of the United States',
    summary: 'Landmark civil rights case in which the Supreme Court ruled that the fundamental right to marry is guaranteed to same-sex couples.'
  },
  {
    id: 'c5',
    name: 'Citizens United v. FEC',
    citation: '558 U.S. 310',
    year: 2010,
    court: 'Supreme Court of the United States',
    summary: 'Landmark decision concerning campaign finance that held that the First Amendment prohibits the government from restricting independent expenditures by corporations, associations, or labor unions.'
  },
];

// Search for cases matching a query
export async function searchCaseLaw(query: string): Promise<CaseLawCase[]> {
  // In a real implementation, this would call an external API
  console.log("Searching for case law:", query);
  
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase();
  
  // Search in name, citation, court, and summary
  return mockCases.filter(
    (c) => 
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.citation.toLowerCase().includes(normalizedQuery) ||
      c.court.toLowerCase().includes(normalizedQuery) ||
      c.summary.toLowerCase().includes(normalizedQuery)
  );
}

// Get more details about a specific case
export async function getCaseDetails(caseId: string): Promise<CaseLawCase | undefined> {
  // In a real implementation, this would call an external API
  console.log("Getting case details for:", caseId);
  
  const foundCase = mockCases.find(c => c.id === caseId);
  
  if (foundCase) {
    // Mock full text that would normally come from an API
    return {
      ...foundCase,
      fullText: `OPINION OF THE COURT:\n\nThis is a mock full text of the case ${foundCase.name} (${foundCase.citation}).\n\nIn this landmark decision, the Court ruled...\n\n[Full text would continue here with the complete opinion of the court]`
    };
  }
  
  return undefined;
}

// React Query hook for case law search
export function useCaseLawSearch(query: string) {
  return useQuery({
    queryKey: ['caseLaw', query],
    queryFn: () => searchCaseLaw(query),
    enabled: !!query.trim(),
  });
}

// React Query hook for case details
export function useCaseDetails(caseId: string | null) {
  return useQuery({
    queryKey: ['caseDetails', caseId],
    queryFn: () => getCaseDetails(caseId || ''),
    enabled: !!caseId,
  });
}
