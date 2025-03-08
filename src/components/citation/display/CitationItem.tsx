
import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Citation } from '@/services/citationService';

interface CitationItemProps {
  citation: Citation;
  citationFormat: 'standard' | 'bluebook' | 'apa' | 'chicago';
  onCopy: (citation: Citation) => void;
  copiedId: string | null;
}

export const CitationItem = ({ 
  citation, 
  citationFormat,
  onCopy, 
  copiedId 
}: CitationItemProps) => {
  return (
    <div 
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
            onClick={() => onCopy(citation)}
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
  );
};
