
import { useState } from 'react';
import { 
  Save, 
  Download, 
  Share2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SaveToCaseDialog from './SaveToCaseDialog';

interface DocumentToolbarProps {
  onBack: () => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  onSaveDocument: () => void;
  documentTitle: string;
  documentContent: string;
  currentDocumentId: string | null;
  onDocumentSaved: (id: string) => void;
}

const DocumentToolbar = ({ 
  onBack, 
  showAiPrompt, 
  setShowAiPrompt,
  onSaveDocument,
  documentTitle,
  documentContent,
  currentDocumentId,
  onDocumentSaved
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
        
        <SaveToCaseDialog 
          documentTitle={documentTitle}
          documentContent={documentContent}
          currentDocumentId={currentDocumentId}
          onSaved={onDocumentSaved}
        />
        
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
