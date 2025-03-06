
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AiPromptInputProps {
  aiPrompt: string;
  setPrompt: (prompt: string) => void;
  isProcessing: boolean;
  onSubmit: (prompt: string) => void;
}

const AiPromptInput = ({ 
  aiPrompt, 
  setPrompt, 
  isProcessing, 
  onSubmit 
}: AiPromptInputProps) => {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        value={aiPrompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt for AI assistance (e.g., 'Add a liability clause')"
        className="flex-1 px-3 py-2 rounded-md border text-sm"
        disabled={isProcessing}
      />
      <Button 
        onClick={() => onSubmit(aiPrompt)}
        disabled={isProcessing || !aiPrompt.trim()}
        size="sm"
        className="gap-1"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isProcessing ? "Processing..." : "Generate"}
      </Button>
    </div>
  );
};

export default AiPromptInput;
