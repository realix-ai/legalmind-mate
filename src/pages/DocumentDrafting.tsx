
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import Navigation from '@/components/Navigation';
import DocumentToolbar from '@/components/document/DocumentToolbar';
import TemplateList from '@/components/document/TemplateList';
import { Button } from '@/components/ui/button';
import { useDocumentState } from '@/hooks/document/useDocumentState';
import { useAiAssistant } from '@/hooks/document/useAiAssistant';
import { useCollaboratorManagement } from '@/hooks/document/useCollaboratorManagement';
import DocumentContent from '@/components/document/DocumentContent';
import DocumentRightPanel from '@/components/document/DocumentRightPanel';

const DocumentDrafting = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  useEffect(() => {
    // Store current document ID for real-time collaboration features
    if (documentId) {
      localStorage.setItem('current_editing_document_id', documentId);
    } else {
      localStorage.removeItem('current_editing_document_id');
    }
    
    // Clean up on unmount
    return () => {
      localStorage.removeItem('current_editing_document_id');
    };
  }, [documentId]);
  
  const {
    showTemplates,
    documentTitle,
    setDocumentTitle,
    documentContent,
    setDocumentContent,
    documentCategory,
    setDocumentCategory,
    currentDocumentId,
    handleSaveDocument,
    handleDocumentSaved,
    handleDocumentLoaded,
    handleBack,
    handleSelectTemplate,
    handleCategoryChange,
  } = useDocumentState(documentId);
  
  const {
    showAiPrompt,
    setShowAiPrompt,
    aiPrompt,
    setAiPrompt,
    isAiProcessing,
    handleAiPromptSubmit
  } = useAiAssistant(setDocumentContent);
  
  const {
    isAddingCollaborator,
    handleAddCollaborator
  } = useCollaboratorManagement();
  
  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };
  
  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6 pt-24">
        {showTemplates ? (
          <TemplateList 
            onSelectTemplate={handleSelectTemplate}
          />
        ) : (
          <div className="space-y-6">
            <DocumentToolbar 
              onBack={handleBack}
              showAiPrompt={showAiPrompt}
              setShowAiPrompt={setShowAiPrompt}
              onSaveDocument={handleSaveDocument}
              documentTitle={documentTitle}
              documentContent={documentContent}
              documentCategory={documentCategory}
              currentDocumentId={currentDocumentId}
              onDocumentSaved={handleDocumentSaved}
              onDocumentLoaded={handleDocumentLoaded}
            />
            
            <div className="flex gap-6 relative">
              {/* Document editor section - expands to full width when right panel is hidden */}
              <div className={`${showRightPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
                <DocumentContent 
                  documentTitle={documentTitle}
                  setDocumentTitle={setDocumentTitle}
                  documentContent={documentContent}
                  setDocumentContent={setDocumentContent}
                  documentCategory={documentCategory}
                  onCategoryChange={handleCategoryChange}
                  showAiPrompt={showAiPrompt}
                  aiPrompt={aiPrompt}
                  setAiPrompt={setAiPrompt}
                  isAiProcessing={isAiProcessing}
                  onAiPromptSubmit={handleAiPromptSubmit}
                />
              </div>
              
              {/* Right panel with comments and collaborators */}
              {showRightPanel && (
                <DocumentRightPanel 
                  documentId={currentDocumentId}
                  isAddingCollaborator={isAddingCollaborator}
                  onAddCollaborator={handleAddCollaborator}
                />
              )}
              
              {/* Panel toggle button */}
              <Button
                onClick={toggleRightPanel}
                variant="outline"
                size="icon"
                className="absolute top-0 right-0 lg:right-[-50px] z-10"
                title={showRightPanel ? "Hide comments panel" : "Show comments panel"}
              >
                {showRightPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentDrafting;
