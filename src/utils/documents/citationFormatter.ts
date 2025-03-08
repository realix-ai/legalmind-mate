// Common legal citation formats
type CitationStyle = 'bluebook' | 'apa' | 'chicago' | 'mla' | 'aglc';

export interface Citation {
  type: 'case' | 'statute' | 'regulation' | 'article' | 'book' | 'website';
  title: string;
  year?: number;
  volume?: string;
  reporter?: string;
  court?: string;
  pageNumber?: string;
  pinpoint?: string;
  url?: string;
  authors?: string[];
  publication?: string;
  section?: string;
  jurisdiction?: string;
  customFormat?: {
    template: string;
    uppercase?: boolean;
    italics?: string[];
    addPeriod?: boolean;
  };
}

export interface FormatOptions {
  style?: CitationStyle;
  includeUrl?: boolean;
  shortForm?: boolean;
  uppercase?: boolean;
  includeJurisdiction?: boolean;
}

export function formatCitation(
  citation: Citation, 
  style: CitationStyle = 'bluebook',
  options: FormatOptions = {}
): string {
  // Handle custom formatting if specified
  if (citation.customFormat) {
    let formatted = citation.customFormat.template;
    
    // Replace placeholders with actual values
    formatted = formatted
      .replace('{title}', citation.title || '')
      .replace('{year}', citation.year?.toString() || '')
      .replace('{volume}', citation.volume || '')
      .replace('{reporter}', citation.reporter || '')
      .replace('{court}', citation.court || '')
      .replace('{page}', citation.pageNumber || '')
      .replace('{pinpoint}', citation.pinpoint || '')
      .replace('{jurisdiction}', citation.jurisdiction || '')
      .replace('{url}', citation.url || '');
    
    // Apply uppercase if specified
    if (citation.customFormat.uppercase) {
      formatted = formatted.toUpperCase();
    }
    
    // Add final period if specified
    if (citation.customFormat.addPeriod && !formatted.endsWith('.')) {
      formatted += '.';
    }
    
    return formatted;
  }

  // Otherwise use the predefined styles
  switch (style) {
    case 'bluebook':
      return formatBluebookCitation(citation, options);
    case 'apa':
      return formatApaCitation(citation, options);
    case 'chicago':
      return formatChicagoCitation(citation, options);
    case 'mla':
      return formatMlaCitation(citation, options);
    case 'aglc':
      return formatAglcCitation(citation, options);
    default:
      return formatBluebookCitation(citation, options);
  }
}

// Format according to The Bluebook: A Uniform System of Citation
function formatBluebookCitation(citation: Citation, options: FormatOptions = {}): string {
  const { shortForm = false, includeUrl = false, includeJurisdiction = true } = options;
  
  switch (citation.type) {
    case 'case': {
      // Short form citation
      if (shortForm) {
        return `${citation.title}, ${citation.pinpoint || citation.pageNumber || ''}`;
      }
      
      // Full citation
      let formatted = `${citation.title}, ${citation.volume || ''} ${citation.reporter || ''} ${citation.pageNumber || ''}`;
      
      if (includeJurisdiction && citation.court) {
        formatted += ` (${citation.court}`;
        if (citation.year) formatted += ` ${citation.year})`;
        else formatted += ')';
      } else if (citation.year) {
        formatted += ` (${citation.year})`;
      }
      
      if (citation.pinpoint) formatted += `, at ${citation.pinpoint}`;
      if (includeUrl && citation.url) formatted += `, ${citation.url}`;
      
      return formatted;
    }
    
    case 'statute': {
      // Format: Title Code § Section (Year)
      let formatted = `${citation.title}${citation.section ? ` § ${citation.section}` : ''} (${citation.year || ''})`;
      if (includeJurisdiction && citation.jurisdiction) {
        formatted += ` (${citation.jurisdiction})`;
      }
      return formatted;
    }
    
    case 'article': {
      // Format: Author, Title, Volume Publication Page (Year)
      const authorText = citation.authors && citation.authors.length > 0 
        ? citation.authors.join(', ') 
        : '';
      let formatted = `${authorText}${authorText ? ', ' : ''}${citation.title}${citation.volume ? `, ${citation.volume}` : ''}${citation.publication ? ` ${citation.publication}` : ''}${citation.pageNumber ? ` ${citation.pageNumber}` : ''} (${citation.year || ''})`;
      if (includeUrl && citation.url) {
        formatted += `, available at ${citation.url}`;
      }
      return formatted;
    }
      
    default:
      return citation.title;
  }
}

function formatApaCitation(citation: Citation, options: FormatOptions = {}): string {
  const { includeUrl = true } = options;
  
  switch (citation.type) {
    case 'case': {
      let formatted = `${citation.title} (${citation.year || ''})`;
      if (citation.reporter) formatted += `. ${citation.volume || ''} ${citation.reporter} ${citation.pageNumber || ''}`;
      if (includeUrl && citation.url) formatted += `. Retrieved from ${citation.url}`;
      return formatted;
    }
    case 'article': {
      const authorText = citation.authors && citation.authors.length > 0 
        ? citation.authors.join(', ') 
        : '';
      let formatted = `${authorText}${authorText ? ' ' : ''}(${citation.year || ''}). ${citation.title}. ${citation.publication || ''}${citation.volume ? `, ${citation.volume}` : ''}${citation.pageNumber ? `, ${citation.pageNumber}` : ''}.`;
      if (includeUrl && citation.url) formatted += ` Retrieved from ${citation.url}`;
      return formatted;
    }
    default:
      return citation.title;
  }
}

function formatChicagoCitation(citation: Citation, options: FormatOptions = {}): string {
  const { includeUrl = false } = options;
  
  switch (citation.type) {
    case 'case': {
      let formatted = `${citation.title}, ${citation.volume || ''} ${citation.reporter || ''} ${citation.pageNumber || ''} (${citation.year || ''})`;
      if (includeUrl && citation.url) formatted += `, ${citation.url}`;
      return formatted;
    }
    case 'article': {
      const authorText = citation.authors && citation.authors.length > 0 
        ? citation.authors.join(', ') 
        : '';
      let formatted = `${authorText}${authorText ? '. ' : ''}"${citation.title}." ${citation.publication || ''}${citation.volume ? ` ${citation.volume}` : ''} (${citation.year || ''})${citation.pageNumber ? `: ${citation.pageNumber}` : ''}.`;
      return formatted;
    }
    default:
      return citation.title;
  }
}

function formatMlaCitation(citation: Citation, options: FormatOptions = {}): string {
  const { includeUrl = false } = options;
  
  switch (citation.type) {
    case 'case': {
      let formatted = `${citation.title}. ${citation.volume || ''} ${citation.reporter || ''} ${citation.pageNumber || ''}. ${citation.year || ''}.`;
      if (includeUrl && citation.url) formatted += ` ${citation.url}. Accessed ${new Date().toLocaleDateString()}.`;
      return formatted;
    }
    default:
      return citation.title;
  }
}

function formatAglcCitation(citation: Citation, options: FormatOptions = {}): string {
  // Australian Guide to Legal Citation formatting
  switch (citation.type) {
    case 'case': {
      let formatted = `${citation.title} (${citation.year || ''}) ${citation.volume || ''} ${citation.reporter || ''} ${citation.pageNumber || ''}`;
      if (citation.court) formatted += ` (${citation.court})`;
      return formatted;
    }
    default:
      return citation.title;
  }
}

// Example citations for testing
export const exampleCitations = {
  case1: {
    type: 'case',
    title: 'Brown v. Board of Education',
    year: 1954,
    volume: '347',
    reporter: 'U.S.',
    pageNumber: '483',
    court: 'Supreme Court'
  },
  statute1: {
    type: 'statute',
    title: '42 U.S.C.',
    section: '1983',
    year: 2021
  },
  article1: {
    type: 'article',
    title: 'The Legal Implications of Remote Work',
    authors: ['Smith, J.', 'Johnson, A.'],
    volume: '42',
    publication: 'Harvard Law Review',
    pageNumber: '1021',
    year: 2022
  }
};

export const citationTypes = [
  { value: 'case', label: 'Case Law' },
  { value: 'statute', label: 'Statute' },
  { value: 'regulation', label: 'Regulation' },
  { value: 'article', label: 'Article' },
  { value: 'book', label: 'Book' },
  { value: 'website', label: 'Website' }
];

export const citationStyles = [
  { value: 'bluebook', label: 'Bluebook' },
  { value: 'apa', label: 'APA' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'mla', label: 'MLA' },
  { value: 'aglc', label: 'AGLC (Australian)' }
];

// Custom formatting templates
export const customCitationTemplates = [
  { 
    name: 'Case with Parenthetical',
    template: '{title}, {volume} {reporter} {page} ({court}, {year}) (explaining that...)',
    type: 'case'
  },
  {
    name: 'Short Case Citation',
    template: '{title}, {page}',
    type: 'case'
  },
  {
    name: 'Statute with Jurisdiction',
    template: '{title} § {section} ({jurisdiction} {year})',
    type: 'statute'
  }
];
