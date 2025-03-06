
import { useState, useRef } from 'react';
import { Sparkles, X, Upload, PaperclipIcon } from 'lucide-react';
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast.error(`${oversizedFiles.length} file(s) exceed the 10MB size limit`);
        return;
      }
      
      setUploadedFiles(files);
      toast.success(`${files.length} file${files.length === 1 ? '' : 's'} uploaded`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
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
          
          <div className="flex flex-col">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={uploadedFiles.length > 0 
                ? "Describe what you want AI to do with these files..." 
                : placeholder}
              className="min-h-[100px] mb-2"
            />
            
            {/* File upload button directly below textarea */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFileUpload}
              disabled={isProcessing}
              className="gap-1 self-start mb-2"
              type="button"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="bg-muted/50 p-2 rounded-md space-y-1">
              <p className="text-sm font-medium mb-1">Uploaded Files:</p>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between text-xs bg-background rounded p-1.5">
                  <span className="truncate max-w-[220px]">{file.name}</span>
                  <button 
                    onClick={() => handleRemoveFile(index)}
                    className="text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isProcessing || (!prompt.trim() && uploadedFiles.length === 0)}
              size="sm"
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
          </div>
          
          <input 
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const getMockAiResponse = (prompt: string, context: string): string => {
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
};

export default AiAssistantButton;
