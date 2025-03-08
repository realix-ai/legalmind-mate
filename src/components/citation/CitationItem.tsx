
import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Citation } from '@/services/citationService';
import { formatCitation } from './citationUtils';
import { toast } from 'sonner';

interface CitationItemProps {
  citation: Citation;
  format: 'standard' | 'bluebook' | 'apa' | 'chicago';
}

const CitationItem = ({ citation, format }: CitationItemProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyCitation = () => {
    const citationText = formatCitation(citation, format);
    
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    toast.success("Citation copied to clipboard");
    
    // Reset copied state after a short delay
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="bg-background rounded-md p-4 text-sm border transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-primary/90">{citation.title}</h4>
          <p className="text-muted-foreground text-xs mt-1">
            {formatCitation(citation, format)}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 relative"
            onClick={handleCopyCitation}
            title="Copy citation"
          >
            {copied ? (
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
  );
};

export default CitationItem;
