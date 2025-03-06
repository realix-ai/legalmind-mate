
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PanelRightClose, PanelRightOpen, MessageSquare } from 'lucide-react';
import Navigation from '@/components/Navigation';
import DocumentToolbar from '@/components/document/DocumentToolbar';
import TemplateList from '@/components/document/TemplateList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDocumentState } from '@/hooks/document/useDocumentState';
import { useAiAssistant } from '@/hooks/document/useAiAssistant';
import { useCollaboratorManagement } from '@/hooks/document/useCollaboratorManagement';
import DocumentContent from '@/components/document/DocumentContent';
import DocumentRightPanel from '@/components/document/DocumentRightPanel';

const DocumentDrafting = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isUsingOpenAI, setIsUsingOpenAI] = useState(false);
  
  useEffect(() => {
    // Check if OpenAI API is configured
    setIsUsingOpenAI(Boolean(localStorage.getItem('openai-api-key')));
  }, []);
  
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
            />
            
            {isUsingOpenAI && (
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <MessageSquare className="h-3 w-3" />
                  ChatGPT Enabled
                </Badge>
              </div>
            )}
            
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
