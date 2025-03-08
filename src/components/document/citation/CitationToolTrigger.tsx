
import React from 'react';
import { Button } from '@/components/ui/button';
import { QuoteIcon } from 'lucide-react';

interface CitationToolTriggerProps {
  className?: string;
}

const CitationToolTrigger = React.forwardRef<HTMLButtonElement, CitationToolTriggerProps>(
  ({ className }, ref) => {
    return (
      <Button 
        data-citation-tool-trigger
        ref={ref}
        variant="outline" 
        size="xs" 
        className={`${className || ''}`}
      >
        <QuoteIcon className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Citations</span>
      </Button>
    );
  }
);

CitationToolTrigger.displayName = "CitationToolTrigger";

export default CitationToolTrigger;
