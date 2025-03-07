
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PromptFormProps {
  onAddPrompt: (text: string) => Promise<boolean>;
  onClose: () => void;
}

const PromptForm = ({ onAddPrompt, onClose }: PromptFormProps) => {
  const [newPromptText, setNewPromptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!newPromptText.trim()) return;
    
    setIsSubmitting(true);
    const success = await onAddPrompt(newPromptText);
    setIsSubmitting(false);
    
    if (success) {
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
        disabled={isSubmitting}
      />
      <Button 
        size="sm" 
        className="h-8"
        onClick={handleSave}
        disabled={isSubmitting || !newPromptText.trim()}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};

export default PromptForm;
