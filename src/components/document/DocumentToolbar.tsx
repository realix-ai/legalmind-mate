
import { useCallback } from 'react';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportOptions from './ExportOptions';
import SaveToCaseDialog from './SaveToCaseDialog';
import SaveToIManageDialog from './SaveToIManageDialog';
import GetFromIManageDialog from './GetFromIManageDialog';
import { useExportDocument } from '@/hooks/document/useExportDocument';
import { SavedDocument } from '@/utils/documents/types';

interface DocumentToolbarProps {
  onBack: () => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  onSaveDocument: () => void;
  documentTitle: string;
  documentContent: string;
  documentCategory: string;
  currentDocumentId: string | null;
  onDocumentSaved: (id: string) => void;
  onDocumentLoaded?: (document: SavedDocument) => void;
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
  onDocumentSaved,
  onDocumentLoaded
}: DocumentToolbarProps) => {
  const exportDocumentUtils = useExportDocument();
  
  const toggleAiPrompt = useCallback(() => {
    setShowAiPrompt(!showAiPrompt);
  }, [showAiPrompt, setShowAiPrompt]);
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Back
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        
        <Button variant="outline" size="xs" onClick={onSaveDocument}>
          <Save className="mr-1 h-3.5 w-3.5" />
          Save
        </Button>
        
        {/* Moved GetFromIManage next to the save button */}
        {onDocumentLoaded && (
          <GetFromIManageDialog onDocumentSelected={onDocumentLoaded} />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <ExportOptions
          title={documentTitle}
          content={documentContent}
          onExportPdf={() => exportDocumentUtils.exportAsPdf(documentTitle, documentContent)}
          onExportDocx={() => exportDocumentUtils.exportAsDocx(documentTitle, documentContent)}
          onExportTxt={() => exportDocumentUtils.exportAsTxt(documentTitle, documentContent)}
          onPrint={() => exportDocumentUtils.printDocument(documentTitle, documentContent)}
        />
        
        <SaveToCaseDialog
          title={documentTitle}
          content={documentContent}
          currentDocumentId={currentDocumentId}
          onSaved={onDocumentSaved}
        />
        
        <SaveToIManageDialog
          title={documentTitle}
          content={documentContent}
          category={documentCategory}
          currentDocumentId={currentDocumentId}
          onSaved={onDocumentSaved}
        />
        
        <Button
          variant={showAiPrompt ? "default" : "outline"}
          size="xs"
          onClick={toggleAiPrompt}
          className="gap-1"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          AI Suggestions
        </Button>
      </div>
    </div>
  );
};

export default DocumentToolbar;
