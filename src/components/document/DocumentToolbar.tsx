
import { useState } from 'react';
import { DOCUMENT_CATEGORIES } from './DocumentCategories';
import { SavedDocument } from '@/utils/documents/types';
import CitationTool from './citation/CitationTool';
import BackButton from './toolbar/BackButton';
import AiAssistantButton from './toolbar/AiAssistantButton';
import LegalCitationsButton from './toolbar/LegalCitationsButton';
import SaveButton from './toolbar/SaveButton';
import SaveToCaseButton from './toolbar/SaveToCaseButton';
import ExportOptions from './export/ExportOptions';
import { SaveToIManageButton, GetFromIManageButton } from './toolbar/IManageButtons';
import ToolbarOverflowMenu from './toolbar/ToolbarOverflowMenu';
import SaveToCaseDialog from './SaveToCaseDialog';
import SaveToIManageDialog from './SaveToIManageDialog';
import GetFromIManageDialog from './GetFromIManageDialog';

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
  onDocumentLoaded: (document: SavedDocument) => void;
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
  onDocumentLoaded,
}: DocumentToolbarProps) => {
  const [showSaveToCaseDialog, setShowSaveToCaseDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSaveToIManageDialog, setShowSaveToIManageDialog] = useState(false);
  const [showGetFromIManageDialog, setShowGetFromIManageDialog] = useState(false);

  const handleInsertCitation = (citation: string) => {
    // Create a citation insertion event
    const event = new CustomEvent('insertCitation', { 
      detail: { text: citation }
    });
    document.dispatchEvent(event);
  };

  const handleInsertCaseText = (text: string) => {
    // Create a case text insertion event
    const event = new CustomEvent('insertCaseText', { 
      detail: { text }
    });
    document.dispatchEvent(event);
  };
  
  const handleCitationButtonClick = () => {
    const citationToolTrigger = document.querySelector('[data-citation-tool-trigger]');
    if (citationToolTrigger) {
      (citationToolTrigger as HTMLButtonElement).click();
    }
  };

  // Define overflow menu actions
  const overflowActions = [
    {
      label: 'Save to Case',
      onClick: () => setShowSaveToCaseDialog(true),
      className: "sm:hidden"
    },
    {
      label: 'Save to iManage',
      onClick: () => setShowSaveToIManageDialog(true),
      className: "lg:hidden"
    },
    {
      label: 'Get from iManage',
      onClick: () => setShowGetFromIManageDialog(true),
      className: "lg:hidden"
    }
  ];
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        
        <div className="flex items-center gap-1">
          <AiAssistantButton 
            showAiPrompt={showAiPrompt} 
            setShowAiPrompt={setShowAiPrompt} 
          />
          
          <LegalCitationsButton onClick={handleCitationButtonClick} />
          
          <CitationTool 
            onInsertCitation={handleInsertCitation}
            onInsertCaseText={handleInsertCaseText}
          />
          
          <SaveButton onSaveDocument={onSaveDocument} />
          
          <SaveToCaseButton 
            onClick={() => setShowSaveToCaseDialog(true)}
            className="hidden sm:flex"
          />
          
          <ExportOptions 
            title={documentTitle}
            content={documentContent}
            open={showExportDialog}
            onOpenChange={setShowExportDialog}
          />
          
          <SaveToIManageButton 
            onClick={() => setShowSaveToIManageDialog(true)}
            className="hidden lg:flex"
          />
          
          <GetFromIManageButton 
            onClick={() => setShowGetFromIManageDialog(true)}
            className="hidden lg:flex"
          />
          
          <ToolbarOverflowMenu actions={overflowActions} />
        </div>
      </div>
      
      <SaveToCaseDialog 
        title={documentTitle}
        content={documentContent}
        currentDocumentId={currentDocumentId}
        onSaved={onDocumentSaved}
        open={showSaveToCaseDialog}
        onOpenChange={setShowSaveToCaseDialog}
      />
      
      <SaveToIManageDialog 
        title={documentTitle}
        content={documentContent}
        category={documentCategory}
        currentDocumentId={currentDocumentId}
        onSaved={onDocumentSaved}
        open={showSaveToIManageDialog}
        onOpenChange={setShowSaveToIManageDialog}
      />
      
      <GetFromIManageDialog 
        onDocumentSelected={onDocumentLoaded}
        open={showGetFromIManageDialog}
        onOpenChange={setShowGetFromIManageDialog}
      />
    </div>
  );
};

export default DocumentToolbar;
