
import React from 'react';
import { Wand2 } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface AiAssistantButtonProps {
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
}

const AiAssistantButton = ({ showAiPrompt, setShowAiPrompt }: AiAssistantButtonProps) => {
  return (
    <ToolbarButton
      icon={Wand2}
      label="AI Assistant"
      onClick={() => setShowAiPrompt(!showAiPrompt)}
    />
  );
};

export default AiAssistantButton;
