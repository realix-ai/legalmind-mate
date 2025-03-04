
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Prompt } from '@/types/prompt';

interface PromptListProps {
  prompts: Prompt[];
  onSelectPrompt: (promptText: string, promptId: string) => void;
  onDeletePrompt: (id: string) => void;
  selectedPromptId: string | null;
}

const PromptList = ({ prompts, onSelectPrompt, onDeletePrompt, selectedPromptId }: PromptListProps) => {
  if (prompts.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">No saved prompts. Add one to get started.</p>
    );
  }

  return (
    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
      {prompts.map((prompt) => (
        <div 
          key={prompt.id}
          className={`flex group items-center text-sm border rounded-md p-2 hover:bg-accent transition-colors ${
            selectedPromptId === prompt.id ? 'bg-accent' : ''
          }`}
        >
          <p 
            className="flex-1 line-clamp-1 cursor-pointer" 
            onClick={() => onSelectPrompt(prompt.text, prompt.id)}
            title={prompt.text}
          >
            {prompt.text}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
            onClick={() => onDeletePrompt(prompt.id)}
            title="Delete prompt"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
