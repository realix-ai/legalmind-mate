
import { Button } from '@/components/ui/button';

interface AiPromptInputProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isAiProcessing: boolean;
  onSubmit: () => void;
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
        onClick={onSubmit}
        disabled={isAiProcessing || !aiPrompt.trim()}
        size="sm"
      >
        {isAiProcessing ? "Processing..." : "Generate"}
      </Button>
    </div>
  );
};

export default AiPromptInput;
