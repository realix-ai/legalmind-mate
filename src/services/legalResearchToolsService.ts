
// Integration with external legal research tools like Westlaw and LexisNexis

export type ResearchToolType = 'westlaw' | 'lexisnexis' | 'googlescholar' | 'heinonline' | 'fastcase' | 'none';

export interface ResearchTool {
  id: ResearchToolType;
  name: string;
  icon: string;
  description: string;
  url: string;
  isConfigured: boolean;
}

// Mock configuration status - in a real app, this would be stored in user preferences
const toolsConfiguration = {
  westlaw: false,
  lexisnexis: false,
  googlescholar: true, // Google Scholar doesn't need API keys
  heinonline: false,
  fastcase: false,
  none: true // 'none' is always configured
};

export const researchTools: ResearchTool[] = [
  {
    id: 'westlaw',
    name: 'Westlaw',
    icon: '📚',
    description: 'Access comprehensive legal research, including cases, statutes, and secondary sources.',
    url: 'https://www.westlaw.com',
    isConfigured: toolsConfiguration.westlaw
  },
  {
    id: 'lexisnexis',
    name: 'LexisNexis',
    icon: '⚖️',
    description: 'Search legal content, public records, and business information.',
    url: 'https://www.lexisnexis.com',
    isConfigured: toolsConfiguration.lexisnexis
  },
  {
    id: 'googlescholar',
    name: 'Google Scholar',
    icon: '🔍',
    description: 'Free access to scholarly literature including legal opinions and journals.',
    url: 'https://scholar.google.com',
    isConfigured: toolsConfiguration.googlescholar
  },
  {
    id: 'heinonline',
    name: 'HeinOnline',
    icon: '📖',
    description: 'Access to legal history and government documents.',
    url: 'https://home.heinonline.org',
    isConfigured: toolsConfiguration.heinonline
  },
  {
    id: 'fastcase',
    name: 'Fastcase',
    icon: '🔎',
    description: 'Legal research service with access to cases, statutes, regulations, and more.',
    url: 'https://www.fastcase.com',
    isConfigured: toolsConfiguration.fastcase
  }
];

// Format a search query for different research platforms
export const formatSearchQuery = (query: string, tool: ResearchToolType): string => {
  switch (tool) {
    case 'westlaw':
      return `https://www.westlaw.com/search/results?query=${encodeURIComponent(query)}&jurisdiction=ALLCASES`;
    case 'lexisnexis':
      return `https://advance.lexis.com/search/?pdmfid=1000516&crid=&pdactivityid=&pdtypeofsearch=searchboxclick&pdsearchterms=${encodeURIComponent(query)}`;
    case 'googlescholar':
      return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
    case 'heinonline':
      return `https://heinonline.org/HOL/LuceneSearch?terms=${encodeURIComponent(query)}&collection=all&searchtype=advanced`;
    case 'fastcase':
      return `https://app.fastcase.com/Research/Search/Home?searchValue=${encodeURIComponent(query)}`;
    case 'none':
    default:
      return '';
  }
};

// Function to search in an external research tool
export const searchExternalTool = (query: string, tool: ResearchToolType): void => {
  if (tool === 'none') return; // No action needed for 'none'
  
  const url = formatSearchQuery(query, tool);
  if (url) {
    window.open(url, '_blank');
  }
};

// Function to check if a tool is configured
export const isToolConfigured = (toolId: ResearchToolType): boolean => {
  return toolsConfiguration[toolId];
};

// Mock function to configure a tool (in a real app, this would save to user settings)
export const configureTool = (toolId: ResearchToolType, apiKey: string): boolean => {
  console.log(`Configuring ${toolId} with key: ${apiKey.substring(0, 3)}...`);
  toolsConfiguration[toolId] = true;
  return true;
};
