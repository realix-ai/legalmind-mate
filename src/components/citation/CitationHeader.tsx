
import { BookOpen } from 'lucide-react';
import { CitationFormatSelector } from './format/CitationFormatSelector';
import { Button } from '@/components/ui/button';

interface CitationHeaderProps {
  citationFormat: 'standard' | 'bluebook' | 'apa' | 'chicago';
  onFormatChange: (format: 'standard' | 'bluebook' | 'apa' | 'chicago') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const CitationHeader = ({
  citationFormat,
  onFormatChange,
  showFilters,
  setShowFilters
}: CitationHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Related Legal Citations</h3>
      </div>
      <div className="flex items-center gap-2">
        <CitationFormatSelector 
          citationFormat={citationFormat} 
          onFormatChange={onFormatChange} 
        />
      </div>
    </div>
  );
};
