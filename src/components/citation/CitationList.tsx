
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Citation } from '@/services/citationService';
import CitationItem from './CitationItem';

interface CitationListProps {
  citations: Citation[];
  displayCitations: Citation[];
  format: 'standard' | 'bluebook' | 'apa' | 'chicago';
  expanded: boolean;
  maxInitialDisplay: number;
  onExpandToggle: () => void;
}

const CitationList = ({
  citations,
  displayCitations,
  format,
  expanded,
  maxInitialDisplay,
  onExpandToggle
}: CitationListProps) => {
  if (citations.length === 0) {
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
            format={format} 
          />
        ))}
      </div>
      
      {citations.length > maxInitialDisplay && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs mt-3 w-full flex items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={onExpandToggle}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show {citations.length - maxInitialDisplay} More {citations.length - maxInitialDisplay === 1 ? 'Citation' : 'Citations'}
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default CitationList;
