
import { useState } from 'react';
import { 
  Save, 
  Download, 
  Share2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentToolbarProps {
  onBack: () => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  onSaveDocument: () => void;
}

const DocumentToolbar = ({ 
  onBack, 
  showAiPrompt, 
  setShowAiPrompt,
  onSaveDocument
}: DocumentToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={onSaveDocument}
        >
          <Save className="h-3 w-3" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
        >
          <Download className="h-3 w-3" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
        >
          <Share2 className="h-3 w-3" />
          Share
        </Button>
        <Button
          variant={showAiPrompt ? "default" : "outline"}
          size="sm"
          className="gap-1 text-xs"
          onClick={() => setShowAiPrompt(!showAiPrompt)}
        >
          <Sparkles className="h-3 w-3" />
          AI Assist
        </Button>
      </div>
    </div>
  );
};

export default DocumentToolbar;
