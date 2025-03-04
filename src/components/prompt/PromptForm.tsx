
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PromptFormProps {
  onAddPrompt: (text: string) => boolean;
  onClose: () => void;
}

const PromptForm = ({ onAddPrompt, onClose }: PromptFormProps) => {
  const [newPromptText, setNewPromptText] = useState('');

  const handleSave = () => {
    if (onAddPrompt(newPromptText)) {
      setNewPromptText('');
      onClose();
    }
  };

  return (
    <div className="mb-3 flex gap-2">
      <input
        type="text"
        value={newPromptText}
        onChange={(e) => setNewPromptText(e.target.value)}
        placeholder="Enter your prompt template"
        className="flex-1 text-sm px-3 py-1 rounded-md border"
      />
      <Button 
        size="sm" 
        className="h-8"
        onClick={handleSave}
      >
        Save
      </Button>
    </div>
  );
};

export default PromptForm;
