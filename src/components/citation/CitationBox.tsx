
import { useState } from 'react';
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  BookOpen,
  Check
} from 'lucide-react';
import { Citation } from '@/services/citationService';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

interface CitationBoxProps {
  citations: Citation[];
  className?: string;
  maxInitialDisplay?: number;
}

const CitationBox = ({ 
  citations, 
  className,
  maxInitialDisplay = 2 
}: CitationBoxProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  if (citations.length === 0) {
    return null;
  }
  
  const displayCitations = expanded ? citations : citations.slice(0, maxInitialDisplay);
  
  const handleCopyCitation = (citation: Citation) => {
    const citationText = `${citation.title}, ${citation.citation} (${citation.court}, ${citation.year})`;
    navigator.clipboard.writeText(citationText);
    setCopiedId(citation.id);
    toast.success("Citation copied to clipboard");
    
    // Reset copied state after a short delay
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  return (
    <div className={cn(
      "mt-6 border rounded-lg p-4 bg-muted/30 shadow-sm",
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Related Legal Citations</h3>
      </div>
      
      <div className="space-y-3">
        {displayCitations.map(citation => (
          <div 
            key={citation.id} 
            className="bg-background rounded-md p-4 text-sm border transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-primary/90">{citation.title}</h4>
                <p className="text-muted-foreground text-xs mt-1">{citation.citation} ({citation.court}, {citation.year})</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 relative"
                  onClick={() => handleCopyCitation(citation)}
                  title="Copy citation"
                >
                  {copiedId === citation.id ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                {citation.url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => window.open(citation.url, '_blank')}
                    title="Open source"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {citation.summary && (
              <p className="mt-3 text-xs text-muted-foreground border-t pt-2 line-clamp-3">
                {citation.summary}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {citations.length > maxInitialDisplay && (
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
              Show {citations.length - maxInitialDisplay} More {citations.length - maxInitialDisplay === 1 ? 'Citation' : 'Citations'}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default CitationBox;
