
import { useState } from 'react';
import { toast } from 'sonner';
import { generateCompletion } from '@/services/openAiService';

export function useAiAssistant(setDocumentContent: (content: string | ((prev: string) => string)) => void) {
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleAiPromptSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    setIsAiProcessing(true);
    toast.loading('Generating content...');
    
    // Check if OpenAI API key is configured
    const apiKey = localStorage.getItem('openai-api-key');
    
    try {
      let aiContent = '';
      
      if (apiKey) {
        // Use OpenAI API
        const systemPrompt = `You are an AI legal writing assistant helping with legal document drafting. 
        Provide clear, professional, and legally sound text based on the user's request. 
        Format your response appropriately for a legal document with proper structure and terminology.`;
        
        const openAiResponse = await generateCompletion(prompt, systemPrompt);
        if (openAiResponse) {
          aiContent = openAiResponse;
          toast.success('Content generated with ChatGPT');
        } else {
          throw new Error('Failed to generate content with ChatGPT');
        }
      } else {
        // Use mock AI response for demo purposes
        aiContent = generateMockAiResponse(prompt);
        toast.success('Content generated successfully');
      }
      
      // Add AI-generated content at the end of the current content
      setDocumentContent(prev => prev + '\n\n' + aiContent);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsAiProcessing(false);
      setAiPrompt('');
      toast.dismiss();
    }
  };

  // Mock AI response generator - used when OpenAI API is not configured
  const generateMockAiResponse = (prompt: string) => {
    if (prompt.includes('conclusion') || prompt.includes('summary')) {
      return "In conclusion, the foregoing analysis demonstrates that the plaintiff's claims are well-founded in both fact and law. The evidence presented clearly establishes all required elements of the cause of action, and relevant case precedent supports our legal theory.";
    } else if (prompt.includes('introduction') || prompt.includes('beginning')) {
      return "INTRODUCTION\n\nThis memorandum addresses the legal and factual issues arising from the dispute between ABC Corporation and XYZ Industries concerning alleged breach of contract and misappropriation of trade secrets.";
    } else {
      return `The requested content related to "${prompt}" has been analyzed, and the following legal assessment can be provided:\n\nBased on the applicable statutes and case law in this jurisdiction, the position appears to be defensible. The key precedent in Johnson v. Smith (2018) established that similar circumstances were found to satisfy the legal standard. However, careful documentation and procedural compliance will be essential to maintain this position.`;
    }
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
