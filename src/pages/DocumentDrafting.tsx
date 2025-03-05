
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import DocumentEditor from '@/components/document/DocumentEditor';
import DocumentToolbar from '@/components/document/DocumentToolbar';
import AiPromptInput from '@/components/document/AiPromptInput';
import CommentSection from '@/components/document/CommentSection';
import TemplateList from '@/components/document/TemplateList';
import { getSavedDocument, saveDocument } from '@/utils/documents';

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
    // Get template or document by ID and set title/content
    const document = getSavedDocument(id);
    if (document) {
      setDocumentTitle(document.title);
      setDocumentContent(document.content);
      setShowTemplates(false);
    }
  };
  
  const handleAiPromptSubmit = () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiProcessing(true);
    toast.loading('Generating content...');
    
    // Simulate AI processing
    setTimeout(() => {
      // Add AI-generated content at the end of the current content
      const aiContent = generateAiResponse(aiPrompt);
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Document Title"
                  className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-primary"
                />
                
                <DocumentEditor
                  documentTitle={documentTitle}
                  setDocumentTitle={setDocumentTitle}
                  documentContent={documentContent}
                  setDocumentContent={setDocumentContent}
                />
              </div>
              
              <div className="space-y-6">
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
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentDrafting;
