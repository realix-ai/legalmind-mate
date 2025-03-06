
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AiAssistantButtonProps {
  context?: string;
  onAssistantResponse?: (response: string) => void;
  placeholder?: string;
  buttonText?: string;
}

const AiAssistantButton = ({
  context = '',
  onAssistantResponse,
  placeholder = 'Ask the AI assistant for help...',
  buttonText = 'AI Assistant'
}: AiAssistantButtonProps) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing your request...');

    try {
      // Check if OpenAI API key is configured
      const apiKey = localStorage.getItem('openai-api-key');
      
      // If there is a key configured, use actual OpenAI service
      if (apiKey) {
        const systemPrompt = `You are an AI legal assistant helping with legal tasks. 
          Context about current view: ${context || 'No specific context provided.'}`;
        
        // Import and use the generateCompletion function
        const { generateCompletion } = await import('@/services/openAiService');
        const response = await generateCompletion(prompt, systemPrompt);
        
        if (response) {
          if (onAssistantResponse) {
            onAssistantResponse(response);
          }
          toast.success('AI assistant responded');
          setOpen(false);
          setPrompt('');
        } else {
          throw new Error('Failed to get response');
        }
      } else {
        // Mock response for demo purposes
        setTimeout(() => {
          const mockResponse = getMockAiResponse(prompt, context);
          if (onAssistantResponse) {
            onAssistantResponse(mockResponse);
          }
          toast.success('AI assistant responded');
          setOpen(false);
          setPrompt('');
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Sparkles className="h-4 w-4" />
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5" 
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px]"
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isProcessing || !prompt.trim()}
              size="sm"
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Helper function to generate mock AI responses
const getMockAiResponse = (prompt: string, context: string): string => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('query') || promptLower.includes('research')) {
    return "I'd recommend using more specific terms in your legal research query. For example, instead of 'breach of contract', try 'material breach of service agreement' for more targeted results.";
  } else if (promptLower.includes('case') || promptLower.includes('manage')) {
    return "To better organize your case files, consider categorizing them by case type, jurisdiction, and priority. This makes retrieval faster and helps with deadline management.";
  } else if (promptLower.includes('document') || promptLower.includes('draft')) {
    return "When drafting legal documents, remember to include clear definitions sections and ensure all referenced parties are consistently named throughout the document.";
  } else {
    return "I'm here to assist with your legal tasks. I can help with research queries, document drafting, case management, and provide general legal guidance.";
  }
};

export default AiAssistantButton;
