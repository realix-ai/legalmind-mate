
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles, PanelRightClose, PanelRightOpen } from 'lucide-react';
import Navigation from '@/components/Navigation';
import DocumentEditor from '@/components/document/DocumentEditor';
import DocumentToolbar from '@/components/document/DocumentToolbar';
import AiPromptInput from '@/components/document/AiPromptInput';
import CommentSection from '@/components/document/CommentSection';
import TemplateList from '@/components/document/TemplateList';
import { getSavedDocument, saveDocument } from '@/utils/documents';
import { Button } from '@/components/ui/button';

const DocumentDrafting = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const [showTemplates, setShowTemplates] = useState(!documentId);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(documentId || null);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  useEffect(() => {
    if (documentId) {
      // Load existing document
      const document = getSavedDocument(documentId);
      if (document) {
        setDocumentTitle(document.title);
        setDocumentContent(document.content);
        setCurrentDocumentId(documentId);
        setShowTemplates(false);
      } else {
        toast.error('Document not found');
        navigate('/document-drafting');
      }
    }
  }, [documentId, navigate]);
  
  const handleSaveDocument = () => {
    if (!documentTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    
    const savedDoc = saveDocument(documentTitle, documentContent, currentDocumentId);
    setCurrentDocumentId(savedDoc.id);
    toast.success('Document saved successfully');
  };
  
  const handleDocumentSaved = (id: string) => {
    setCurrentDocumentId(id);
  };
  
  const handleBack = () => {
    if (documentId) {
      navigate('/cases');
    } else {
      setShowTemplates(true);
    }
  };
  
  const handleSelectTemplate = (id: string) => {
    if (id === 'blank') {
      // Create a new blank document
      setDocumentTitle('Untitled Document');
      setDocumentContent('');
      setShowTemplates(false);
      return;
    }
    
    // Get template or document by ID and set title/content
    const document = getSavedDocument(id);
    if (document) {
      setDocumentTitle(document.title);
      setDocumentContent(document.content);
      setShowTemplates(false);
    }
  };
  
  const handleAiPromptSubmit = (prompt: string) => {
    if (!prompt.trim()) return;
    
    setIsAiProcessing(true);
    toast.loading('Generating content...');
    
    // Simulate AI processing
    setTimeout(() => {
      // Add AI-generated content at the end of the current content
      const aiContent = generateAiResponse(prompt);
      setDocumentContent(prev => prev + '\n\n' + aiContent);
      setIsAiProcessing(false);
      setAiPrompt('');
      toast.dismiss();
      toast.success('Content generated successfully');
    }, 1500);
  };
  
  // Mock AI response generator
  const generateAiResponse = (prompt: string) => {
    if (prompt.includes('conclusion') || prompt.includes('summary')) {
      return "In conclusion, the foregoing analysis demonstrates that the plaintiff's claims are well-founded in both fact and law. The evidence presented clearly establishes all required elements of the cause of action, and relevant case precedent supports our legal theory.";
    } else if (prompt.includes('introduction') || prompt.includes('beginning')) {
      return "INTRODUCTION\n\nThis memorandum addresses the legal and factual issues arising from the dispute between ABC Corporation and XYZ Industries concerning alleged breach of contract and misappropriation of trade secrets.";
    } else {
      return `The requested content related to "${prompt}" has been analyzed, and the following legal assessment can be provided:\n\nBased on the applicable statutes and case law in this jurisdiction, the position appears to be defensible. The key precedent in Johnson v. Smith (2018) established that similar circumstances were found to satisfy the legal standard. However, careful documentation and procedural compliance will be essential to maintain this position.`;
    }
  };
  
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
              currentDocumentId={currentDocumentId}
              onDocumentSaved={handleDocumentSaved}
            />
            
            <div className="flex gap-6 relative">
              {/* Document editor section - expands to full width when right panel is hidden */}
              <div className={`${showRightPanel ? 'w-2/3' : 'w-full'} space-y-6 transition-all duration-300`}>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Document Title"
                  className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-primary/50 transition-all duration-200"
                />
                
                <DocumentEditor
                  documentTitle={documentTitle}
                  setDocumentTitle={setDocumentTitle}
                  documentContent={documentContent}
                  setDocumentContent={setDocumentContent}
                />
              </div>
              
              {/* Right panel with comments and AI prompt */}
              {showRightPanel && (
                <div className="w-1/3 space-y-6">
                  {showAiPrompt && (
                    <div className="p-4 border rounded-md bg-card">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">AI Assistant</h3>
                      </div>
                      <AiPromptInput 
                        aiPrompt={aiPrompt}
                        setAiPrompt={setAiPrompt}
                        isAiProcessing={isAiProcessing}
                        onSubmit={handleAiPromptSubmit}
                      />
                    </div>
                  )}
                  
                  <CommentSection documentId={currentDocumentId} />
                </div>
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
