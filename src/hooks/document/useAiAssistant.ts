
import { useState } from 'react';
import { toast } from 'sonner';

// Mock AI response generator - moved from the page component
const generateAiResponse = (prompt: string) => {
  if (prompt.includes('conclusion') || prompt.includes('summary')) {
    return "In conclusion, the foregoing analysis demonstrates that the plaintiff's claims are well-founded in both fact and law. The evidence presented clearly establishes all required elements of the cause of action, and relevant case precedent supports our legal theory.";
  } else if (prompt.includes('introduction') || prompt.includes('beginning')) {
    return "INTRODUCTION\n\nThis memorandum addresses the legal and factual issues arising from the dispute between ABC Corporation and XYZ Industries concerning alleged breach of contract and misappropriation of trade secrets.";
  } else {
    return `The requested content related to "${prompt}" has been analyzed, and the following legal assessment can be provided:\n\nBased on the applicable statutes and case law in this jurisdiction, the position appears to be defensible. The key precedent in Johnson v. Smith (2018) established that similar circumstances were found to satisfy the legal standard. However, careful documentation and procedural compliance will be essential to maintain this position.`;
  }
};

export function useAiAssistant(setDocumentContent: (content: string | ((prev: string) => string)) => void) {
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

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

  return {
    showAiPrompt,
    setShowAiPrompt,
    aiPrompt,
    setAiPrompt,
    isAiProcessing,
    handleAiPromptSubmit
  };
}
