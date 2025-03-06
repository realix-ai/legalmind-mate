
import { useState } from 'react';
import { Sparkles, X, PaperclipIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFileUpload } from '@/hooks/ai/useFileUpload';
import { useAiSubmission } from '@/hooks/ai/useAiSubmission';
import AiPromptForm from './AiPromptForm';

interface AiAssistantButtonProps {
  context?: string;
  onAssistantResponse?: (response: string) => void;
  placeholder?: string;
  buttonText?: string;
  showUploadButton?: boolean;
}

const AiAssistantButton = ({
  context = '',
  onAssistantResponse,
  placeholder = 'Ask the AI assistant for help...',
  buttonText = 'AI Assistant',
  showUploadButton = true
}: AiAssistantButtonProps) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  const {
    uploadedFiles,
    setUploadedFiles,
    fileInputRef,
    handleFileUpload,
    handleFileChange,
    handleRemoveFile
  } = useFileUpload();
  
  const { isProcessing, handleSubmit } = useAiSubmission({
    context,
    onAssistantResponse,
    setOpen,
    setPrompt,
    setUploadedFiles
  });
  
  const onSubmit = () => {
    handleSubmit(prompt, uploadedFiles);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Sparkles className="h-4 w-4" />
          {buttonText}
          {showUploadButton && uploadedFiles.length > 0 && (
            <span className="relative">
              <PaperclipIcon className="h-3 w-3" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
            </span>
          )}
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
          
          <AiPromptForm
            prompt={prompt}
            setPrompt={setPrompt}
            placeholder={placeholder}
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            handleSubmit={onSubmit}
            isProcessing={isProcessing}
            showUploadButton={showUploadButton}
          />
          
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

export default AiAssistantButton;
