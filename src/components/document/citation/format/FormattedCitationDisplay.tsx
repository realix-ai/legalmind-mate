
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, FileText, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface FormattedCitationDisplayProps {
  citation: string;
  hasTitle: boolean;
  onGenerateClick: () => void;
  onInsertClick: () => void;
  formatOptions?: {
    includeUrl?: boolean;
    shortForm?: boolean;
    uppercase?: boolean;
  };
  onFormatOptionsChange?: (options: any) => void;
}

export function FormattedCitationDisplay({
  citation,
  hasTitle,
  onGenerateClick,
  onInsertClick,
  formatOptions,
  onFormatOptionsChange
}: FormattedCitationDisplayProps) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const handleOptionChange = (option: string, value: boolean) => {
    if (onFormatOptionsChange && formatOptions) {
      onFormatOptionsChange({
        ...formatOptions,
        [option]: value
      });
    }
  };
  
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
      
      {/* Advanced formatting options toggle */}
      <div className="flex items-center justify-between">
        <Label>Formatted Citation:</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <Settings className="h-3 w-3 mr-1" />
          Options
        </Button>
      </div>
      
      {/* Advanced formatting options */}
      {showAdvancedOptions && formatOptions && onFormatOptionsChange && (
        <div className="p-3 border rounded-md bg-muted/30 text-xs space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <span>Include URL</span>
            <Switch 
              checked={formatOptions.includeUrl || false}
              onCheckedChange={(checked) => handleOptionChange('includeUrl', checked)}
              className="scale-75"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Short Form</span>
            <Switch 
              checked={formatOptions.shortForm || false}
              onCheckedChange={(checked) => handleOptionChange('shortForm', checked)}
              className="scale-75"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Uppercase Title</span>
            <Switch 
              checked={formatOptions.uppercase || false}
              onCheckedChange={(checked) => handleOptionChange('uppercase', checked)}
              className="scale-75"
            />
          </div>
        </div>
      )}
      
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
