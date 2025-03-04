
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const ChatInput = ({ onSendMessage, isDisabled }: ChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage);
    setCurrentMessage('');
  };

  return (
    <div className="p-4 border-t bg-secondary/30">
      <form 
        className="flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <Input 
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask about this case..."
          className="flex-1 bg-white dark:bg-card border shadow-sm focus-visible:ring-primary"
        />
        <Button 
          type="submit"
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || isDisabled}
          className="shrink-0"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
