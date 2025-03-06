
import { useState } from 'react';
import { toast } from 'sonner';

interface UseAiSubmissionProps {
  context: string;
  onAssistantResponse?: (response: string) => void;
  setOpen: (open: boolean) => void;
  setPrompt: (prompt: string) => void;
  setUploadedFiles: (files: File[]) => void;
}

export function useAiSubmission({
  context,
  onAssistantResponse,
  setOpen,
  setPrompt,
  setUploadedFiles
}: UseAiSubmissionProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (prompt: string, uploadedFiles: File[]) => {
    if (!prompt.trim() && uploadedFiles.length === 0) {
      toast.error("Please enter a prompt or upload files");
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing your request...');

    try {
      const apiKey = localStorage.getItem('openai-api-key');
      
      if (apiKey) {
        const systemPrompt = `You are an AI legal assistant helping with legal tasks. 
          Context about current view: ${context || 'No specific context provided.'}`;
        
        let response = '';
        
        if (uploadedFiles.length > 0) {
          const fileContents = await Promise.all(
            uploadedFiles.map(async (file) => {
              if (file.type.includes('text') || file.name.endsWith('.txt')) {
                return await file.text();
              } else {
                return `[File: ${file.name}, Size: ${Math.round(file.size / 1024)}KB]`;
              }
            })
          );
          
          const { generateCompletion } = await import('@/services/openAiService');
          
          const enhancedPrompt = `${prompt || 'Please analyze these files:'}\n\nFiles:\n${fileContents.join('\n\n')}`;
          
          response = await generateCompletion(enhancedPrompt, systemPrompt) || '';
        } else {
          const { generateCompletion } = await import('@/services/openAiService');
          response = await generateCompletion(prompt, systemPrompt) || '';
        }
        
        if (response) {
          if (onAssistantResponse) {
            onAssistantResponse(response);
          }
          toast.success('AI assistant responded');
          setOpen(false);
          setPrompt('');
          setUploadedFiles([]);
        } else {
          throw new Error('Failed to get response');
        }
      } else {
        setTimeout(() => {
          let mockResponse = '';
          
          if (uploadedFiles.length > 0) {
            mockResponse = `I've analyzed your ${uploadedFiles.length} file(s) (${uploadedFiles.map(f => f.name).join(', ')}). `;
            mockResponse += getMockAiResponse(prompt || 'analyze these files', context);
          } else {
            mockResponse = getMockAiResponse(prompt, context);
          }
          
          if (onAssistantResponse) {
            onAssistantResponse(mockResponse);
          }
          toast.success('AI assistant responded');
          setOpen(false);
          setPrompt('');
          setUploadedFiles([]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error with AI assistant:', error);
      toast.error('Failed to process request');
    } finally {
      setIsProcessing(false);
      toast.dismiss();
    }
  };

  return {
    isProcessing,
    handleSubmit
  };
}

// Moved the mock response function here
function getMockAiResponse(prompt: string, context: string): string {
  const promptLower = prompt?.toLowerCase() || '';
  
  if (promptLower.includes('file') || promptLower.includes('document') || promptLower.includes('upload')) {
    return "Based on the files you've provided, I can see several key points worth noting. The document appears to contain legal language related to contractual agreements. I would recommend paying particular attention to sections dealing with liability, termination conditions, and dispute resolution.";
  } else if (promptLower.includes('query') || promptLower.includes('research')) {
    return "I'd recommend using more specific terms in your legal research query. For example, instead of 'breach of contract', try 'material breach of service agreement' for more targeted results.";
  } else if (promptLower.includes('case') || promptLower.includes('manage')) {
    return "To better organize your case files, consider categorizing them by case type, jurisdiction, and priority. This makes retrieval faster and helps with deadline management.";
  } else if (promptLower.includes('draft')) {
    return "When drafting legal documents, remember to include clear definitions sections and ensure all referenced parties are consistently named throughout the document.";
  } else {
    return "I'm here to assist with your legal tasks. I can help with research queries, document drafting, case management, and provide general legal guidance.";
  }
}
