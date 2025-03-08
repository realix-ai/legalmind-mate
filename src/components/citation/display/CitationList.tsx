
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Citation } from '@/services/citationService';
import { CitationItem } from './CitationItem';

interface CitationListProps {
  displayCitations: Citation[];
  filteredCitations: Citation[];
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  maxInitialDisplay: number;
  onCopyCitation: (citation: Citation) => void;
  copiedId: string | null;
  citationFormat: 'standard' | 'bluebook' | 'apa' | 'chicago';
}

export const CitationList = ({
  displayCitations,
  filteredCitations,
  expanded,
  setExpanded,
  maxInitialDisplay,
  onCopyCitation,
  copiedId,
  citationFormat
}: CitationListProps) => {
  if (filteredCitations.length === 0) {
    return (
      <div className="bg-background rounded-md p-4 text-sm border">
        <p className="text-muted-foreground text-center">No citations match the current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {displayCitations.map(citation => (
          <CitationItem 
            key={citation.id}
            citation={citation}
            citationFormat={citationFormat}
            onCopy={onCopyCitation}
            copiedId={copiedId}
          />
        ))}
      </div>
      
      {filteredCitations.length > maxInitialDisplay && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs mt-3 w-full flex items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show {filteredCitations.length - maxInitialDisplay} More {filteredCitations.length - maxInitialDisplay === 1 ? 'Citation' : 'Citations'}
            </>
          )}
        </Button>
      )}
    </>
  );
};
