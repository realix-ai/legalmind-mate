
import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Citation } from '@/services/citationService';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface CitationBoxProps {
  citations: Citation[];
}

const CitationBox = ({ citations }: CitationBoxProps) => {
  const [expanded, setExpanded] = useState(false);
  
  if (citations.length === 0) {
    return null;
  }
  
  const displayCitations = expanded ? citations : citations.slice(0, 2);
  
  const handleCopyCitation = (citation: Citation) => {
    const citationText = `${citation.title}, ${citation.citation} (${citation.court}, ${citation.year})`;
    navigator.clipboard.writeText(citationText);
    toast.success("Citation copied to clipboard");
  };
  
  return (
    <div className="mt-6 border rounded-lg p-4 bg-muted/30">
      <h3 className="text-sm font-medium mb-3">Related Legal Citations</h3>
      
      <div className="space-y-3">
        {displayCitations.map(citation => (
          <div key={citation.id} className="bg-background rounded p-3 text-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{citation.title}</h4>
                <p className="text-muted-foreground text-xs">{citation.citation} ({citation.court}, {citation.year})</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopyCitation(citation)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {citation.url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => window.open(citation.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {citation.summary && (
              <p className="mt-2 text-xs">{citation.summary}</p>
            )}
          </div>
        ))}
      </div>
      
      {citations.length > 2 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs mt-2 w-full"
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
              Show {citations.length - 2} More Citations
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default CitationBox;
