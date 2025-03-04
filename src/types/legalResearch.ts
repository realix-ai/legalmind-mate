
export type LegalResearchResult = {
  id: string;
  title: string;
  citation: string;
  snippet: string;
  url: string;
  source: string;
  date: string;
  type: 'case' | 'statute' | 'article' | 'other';
};

export type SearchHistoryItem = {
  id: string;
  query: string;
  source: 'westlaw' | 'lexisnexis' | 'googlescholar';
  date: string;
  timestamp: number;
  resultCount: number;
};
