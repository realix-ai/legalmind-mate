
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AiPromptInputProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isAiProcessing: boolean;
  onSubmit: (prompt: string) => void;  // Updated the type to accept a prompt parameter
}

const AiPromptInput = ({ 
  aiPrompt, 
  setAiPrompt, 
  isAiProcessing, 
  onSubmit 
}: AiPromptInputProps) => {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        placeholder="Enter a prompt for AI assistance (e.g., 'Add a liability clause')"
        className="flex-1 px-3 py-2 rounded-md border text-sm"
        disabled={isAiProcessing}
      />
      <Button 
        onClick={() => onSubmit(aiPrompt)}  // Update to pass the current prompt to the onSubmit function
        disabled={isAiProcessing || !aiPrompt.trim()}
        size="sm"
        className="gap-1"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isAiProcessing ? "Processing..." : "Generate"}
      </Button>
    </div>
  );
};

export default AiPromptInput;
