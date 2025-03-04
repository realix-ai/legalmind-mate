
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { toast } from '@/components/ui/use-toast';
import { 
  templates, 
  getTemplateContent, 
  saveDocument, 
  getSavedDocuments, 
  getSavedDocument, 
  SavedDocument,
  getCustomTemplates,
  CustomTemplate,
  getCases
} from '@/utils/documents';
import TemplateList from '@/components/document/TemplateList';
import DocumentToolbar from '@/components/document/DocumentToolbar';
import AiPromptInput from '@/components/document/AiPromptInput';
import DocumentEditor from '@/components/document/DocumentEditor';

const DocumentDrafting = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [documentContent, setDocumentContent] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [cases, setCases] = useState<{id: string, name: string}[]>([]);
  
  // Load saved documents and custom templates on mount
  useEffect(() => {
    setSavedDocuments(getSavedDocuments());
    setCustomTemplates(getCustomTemplates());
    setCases(getCases());
  }, []);
  
  const handleSelectTemplate = (id: string) => {
    if (id.startsWith('doc-')) {
      // This is a saved document, not a template
      const savedDoc = getSavedDocument(id);
      if (savedDoc) {
        setCurrentDocumentId(savedDoc.id);
        setDocumentTitle(savedDoc.title);
        setDocumentContent(savedDoc.content);
        setSelectedTemplate('saved');
      }
    } else if (id.startsWith('custom-')) {
      // This is a custom template
      const customTemplate = customTemplates.find(t => t.id === id);
      if (customTemplate) {
        setCurrentDocumentId(null);
        setSelectedTemplate(id);
        setDocumentContent(customTemplate.content);
        setDocumentTitle(`${customTemplate.title} Copy`);
      }
    } else {
      // This is a predefined template
      setCurrentDocumentId(null);
      setSelectedTemplate(id);
      setDocumentContent(getTemplateContent(id));
      setDocumentTitle(id === 'new' ? 'Untitled Document' : templates.find(t => t.id === id)?.title || 'Untitled Document');
    }
  };
  
  const handleNewDocument = () => {
    setSelectedTemplate(null);
    setCurrentDocumentId(null);
    setDocumentTitle('Untitled Document');
    setDocumentContent('');
  };
  
  const handleSaveDocument = () => {
    try {
      const saved = saveDocument(documentTitle, documentContent, currentDocumentId);
      setCurrentDocumentId(saved.id);
      setSavedDocuments(getSavedDocuments());
      
      toast({
        title: "Document saved",
        description: "Your document has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your document.",
        variant: "destructive"
      });
    }
  };
  
  const handleTemplateAdded = () => {
    setCustomTemplates(getCustomTemplates());
  };
  
  const handleAiAssist = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for AI assistance.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAiProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const currentContent = documentContent;
      const aiGeneratedContent = `${currentContent}\n\n[AI-GENERATED CONTENT BASED ON: "${aiPrompt}"]\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.`;
      
      setDocumentContent(aiGeneratedContent);
      setIsAiProcessing(false);
      setShowAiPrompt(false);
      setAiPrompt('');
      
      toast({
        title: "AI content generated",
        description: "The AI has updated your document based on your prompt.",
      });
    }, 2000);
  };

  const handleDocumentSaved = (documentId: string) => {
    setCurrentDocumentId(documentId);
    setSavedDocuments(getSavedDocuments());
    setCases(getCases());
  };

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        {!selectedTemplate ? (
          <TemplateList 
            templates={templates}
            customTemplates={customTemplates}
            savedDocuments={savedDocuments}
            onSelectTemplate={handleSelectTemplate}
            onCreateBlank={() => handleSelectTemplate('new')}
            onTemplateAdded={handleTemplateAdded}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentToolbar 
              onBack={handleNewDocument}
              showAiPrompt={showAiPrompt}
              setShowAiPrompt={setShowAiPrompt}
              onSaveDocument={handleSaveDocument}
              documentTitle={documentTitle}
              documentContent={documentContent}
              currentDocumentId={currentDocumentId}
              onDocumentSaved={handleDocumentSaved}
            />
            
            {showAiPrompt && (
              <AiPromptInput 
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                isAiProcessing={isAiProcessing}
                onSubmit={handleAiAssist}
              />
            )}
            
            <DocumentEditor 
              documentTitle={documentTitle}
              setDocumentTitle={setDocumentTitle}
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
            />
            
            <div className="text-center text-sm text-muted-foreground">
              {isAiProcessing ? 
                "AI is generating content..." : 
                currentDocumentId ? 
                  "All changes are saved automatically when you click Save." : 
                  "Remember to save your document to access it later."
              }
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DocumentDrafting;
