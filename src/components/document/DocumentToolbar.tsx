
import { useCallback } from 'react';
import { ArrowLeft, FileText, Save, Sparkles, Share, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiAssistantButton from '@/components/ai/AiAssistantButton';
import ExportOptions from './ExportOptions';
import SaveToCaseDialog from './SaveToCaseDialog';
import { toast } from 'sonner';
import { useExportDocument } from '@/hooks/document/useExportDocument';

interface DocumentToolbarProps {
  onBack: () => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  onSaveDocument: () => void;
  documentTitle: string;
  documentContent: string;
  documentCategory: string;
  currentDocumentId: string | null;
  onDocumentSaved: () => void;
}

const DocumentToolbar = ({
  onBack,
  showAiPrompt,
  setShowAiPrompt,
  onSaveDocument,
  documentTitle,
  documentContent,
  documentCategory,
  currentDocumentId,
  onDocumentSaved
}: DocumentToolbarProps) => {
  const { exportDocument, isExporting } = useExportDocument();
  
  const toggleAiPrompt = useCallback(() => {
    setShowAiPrompt(!showAiPrompt);
  }, [showAiPrompt, setShowAiPrompt]);
  
  const handleAiAssistantResponse = useCallback((response: string) => {
    // You can process the AI assistant response here
    // For example, you might want to insert it into the document
    toast.info("AI Assistant responded successfully");
  }, []);
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        
        <Button variant="outline" size="sm" onClick={onSaveDocument}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <ExportOptions
          documentTitle={documentTitle}
          documentContent={documentContent}
          onExport={exportDocument}
          isExporting={isExporting}
        />
        
        <SaveToCaseDialog
          documentTitle={documentTitle}
          documentContent={documentContent}
          documentId={currentDocumentId}
          onSaved={onDocumentSaved}
        />
        
        <Button
          variant={showAiPrompt ? "default" : "outline"}
          size="sm"
          onClick={toggleAiPrompt}
          className="gap-1"
        >
          <Sparkles className="h-4 w-4" />
          AI Suggestions
        </Button>
        
        <AiAssistantButton 
          context={`Document editing for: ${documentTitle}. Category: ${documentCategory}`}
          onAssistantResponse={handleAiAssistantResponse}
          placeholder="Ask for help with your document..."
          buttonText="AI Helper"
          showUploadButton={true}
        />
      </div>
    </div>
  );
};

export default DocumentToolbar;
