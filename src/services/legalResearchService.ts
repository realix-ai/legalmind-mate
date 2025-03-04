
import { toast } from "sonner";

export interface LegalSearchResult {
  id: string;
  title: string;
  citation: string;
  snippets: string[];
  url: string;
  source: 'westlaw' | 'lexisnexis' | 'google-scholar';
  relevanceScore: number;
}

export interface LegalServiceProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  isConnected: boolean;
  isAvailable: boolean;
}

export const getLegalServiceProviders = (): LegalServiceProvider[] => {
  return [
    {
      id: 'westlaw',
      name: 'Westlaw',
      icon: '⚖️',
      description: 'Connect to Westlaw for comprehensive legal research',
      isConnected: true,
      isAvailable: true
    },
    {
      id: 'lexisnexis',
      name: 'LexisNexis',
      icon: '📚',
      description: 'Access LexisNexis legal database',
      isConnected: false,
      isAvailable: true
    },
    {
      id: 'google-scholar',
      name: 'Google Scholar',
      icon: '🔍',
      description: 'Search free legal opinions on Google Scholar',
      isConnected: true,
      isAvailable: true
    },
    {
      id: 'hein-online',
      name: 'HeinOnline',
      icon: '📜',
      description: 'Connect to HeinOnline for historical legal documents',
      isConnected: false,
      isAvailable: false
    }
  ];
};

// Mock search results for Westlaw
const mockWestlawResults: LegalSearchResult[] = [
  {
    id: 'wl-1',
    title: 'Brown v. Board of Education',
    citation: '347 U.S. 483 (1954)',
    snippets: [
      'We conclude that, in the field of public education, the doctrine of "separate but equal" has no place.',
      'Separate educational facilities are inherently unequal.'
    ],
    url: 'https://westlaw.com/document/brown-v-board',
    source: 'westlaw',
    relevanceScore: 0.95
  },
  {
    id: 'wl-2',
    title: 'Miranda v. Arizona',
    citation: '384 U.S. 436 (1966)',
    snippets: [
      'The person in custody must, prior to interrogation, be clearly informed that he has the right to remain silent.',
      'The right to remain silent and right to a lawyer are indispensable to protection of the Fifth Amendment privilege.'
    ],
    url: 'https://westlaw.com/document/miranda-v-arizona',
    source: 'westlaw',
    relevanceScore: 0.88
  }
];

// Mock search results for LexisNexis
const mockLexisNexisResults: LegalSearchResult[] = [
  {
    id: 'ln-1',
    title: 'Roe v. Wade',
    citation: '410 U.S. 113 (1973)',
    snippets: [
      'We recognize the right of personal privacy includes the abortion decision, but that this right is not unqualified and must be considered against important state interests.',
      'The State does have an important and legitimate interest in protecting potential life.'
    ],
    url: 'https://lexisnexis.com/document/roe-v-wade',
    source: 'lexisnexis',
    relevanceScore: 0.92
  }
];

// Mock search results for Google Scholar
const mockGoogleScholarResults: LegalSearchResult[] = [
  {
    id: 'gs-1',
    title: 'Obergefell v. Hodges',
    citation: '576 U.S. 644 (2015)',
    snippets: [
      'The right to marry is a fundamental right inherent in the liberty of the person.',
      'The Constitution does not permit the State to bar same-sex couples from marriage on the same terms as accorded to couples of the opposite sex.'
    ],
    url: 'https://scholar.google.com/scholar_case?case=obergefell-v-hodges',
    source: 'google-scholar',
    relevanceScore: 0.93
  }
];

export const searchLegalServices = async (
  query: string,
  sources: string[]
): Promise<LegalSearchResult[]> => {
  console.log(`Searching legal sources: ${sources.join(', ')} for "${query}"`);
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let allResults: LegalSearchResult[] = [];
  
  if (sources.includes('westlaw')) {
    allResults = [...allResults, ...mockWestlawResults];
  }
  
  if (sources.includes('lexisnexis')) {
    allResults = [...allResults, ...mockLexisNexisResults];
  }
  
  if (sources.includes('google-scholar')) {
    allResults = [...allResults, ...mockGoogleScholarResults];
  }
  
  // Sort by relevance
  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return allResults;
};

export const connectLegalService = async (serviceId: string): Promise<boolean> => {
  console.log(`Connecting to legal service: ${serviceId}`);
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, always succeed except for HeinOnline
  if (serviceId === 'hein-online') {
    toast.error('This service is currently unavailable');
    return false;
  }
  
  toast.success(`Connected to ${serviceId} successfully`);
  return true;
};

export const disconnectLegalService = async (serviceId: string): Promise<boolean> => {
  console.log(`Disconnecting from legal service: ${serviceId}`);
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  toast.success(`Disconnected from ${serviceId}`);
  return true;
};
