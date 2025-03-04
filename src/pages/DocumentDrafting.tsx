
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { toast } from '@/components/ui/use-toast';
import { templates, getTemplateContent } from '@/utils/documentTemplates';
import TemplateList from '@/components/document/TemplateList';
import DocumentToolbar from '@/components/document/DocumentToolbar';
import AiPromptInput from '@/components/document/AiPromptInput';
import DocumentEditor from '@/components/document/DocumentEditor';

const DocumentDrafting = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [documentContent, setDocumentContent] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setDocumentContent(getTemplateContent(id));
  };
  
  const handleNewDocument = () => {
    setSelectedTemplate(null);
    setDocumentTitle('Untitled Document');
    setDocumentContent('');
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

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        {!selectedTemplate ? (
          <TemplateList 
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onCreateBlank={() => handleSelectTemplate('new')}
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
              {isAiProcessing ? "AI is generating content..." : "All changes are automatically saved as you type."}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DocumentDrafting;
