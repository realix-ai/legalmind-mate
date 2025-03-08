
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, FileText } from 'lucide-react';

interface FormattedCitationDisplayProps {
  citation: string;
  hasTitle: boolean;
  onGenerateClick: () => void;
  onInsertClick: () => void;
}

export function FormattedCitationDisplay({
  citation,
  hasTitle,
  onGenerateClick,
  onInsertClick
}: FormattedCitationDisplayProps) {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onGenerateClick}
        className="w-full mb-4"
        variant="secondary"
      >
        <FileText className="mr-2 h-4 w-4" />
        Generate Citation
      </Button>
      
      <Label>Formatted Citation:</Label>
      <div className={`p-3 border rounded-md ${hasTitle ? 'bg-muted/80' : 'bg-muted/30'}`}>
        <p className="break-all text-sm font-mono">
          {hasTitle ? citation : 'Enter a title to preview your citation'}
        </p>
      </div>
      <Button 
        onClick={onInsertClick} 
        className="w-full"
        disabled={!hasTitle}
      >
        <Check className="mr-2 h-4 w-4" />
        Insert Citation
      </Button>
    </div>
  );
}
