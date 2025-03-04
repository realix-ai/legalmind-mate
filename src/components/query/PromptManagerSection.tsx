
import { RefObject } from 'react';
import PromptManager from '@/components/PromptManager';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';

interface PromptManagerSectionProps {
  showPromptManager: boolean;
  promptManagerRef: RefObject<HTMLDivElement>;
  togglePromptManager: () => void;
  onLoadPrompt: (promptText: string) => void;
}

const PromptManagerSection = ({ 
  showPromptManager, 
  promptManagerRef, 
  togglePromptManager, 
  onLoadPrompt 
}: PromptManagerSectionProps) => {
  return (
    <>
      <div className="relative mb-2">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 absolute left-0 top-0 z-10 text-xs py-1 px-2 h-7"
          onClick={togglePromptManager}
          data-prompt-button="true"
        >
          <List className="h-3 w-3" />
          Load Prompts
        </Button>
      </div>
      
      {showPromptManager && (
        <div 
          ref={promptManagerRef}
          className="relative z-10 w-72 shadow-md mb-4 mt-14"
        >
          <PromptManager onSelectPrompt={onLoadPrompt} />
        </div>
      )}
    </>
  );
};

export default PromptManagerSection;
