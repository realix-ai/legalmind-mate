
import { Trash2 } from 'lucide-react';
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
            variant="destructive"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onDeletePrompt(prompt.id)}
            title="Delete prompt"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
