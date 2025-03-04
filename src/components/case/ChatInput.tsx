
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

  // Auto-resize textarea based on content
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
    // Reset height first to get accurate scrollHeight
    e.target.style.height = 'auto';
    // Set new height based on content
    const newHeight = Math.min(e.target.scrollHeight, 120); // Max height of 120px
    e.target.style.height = `${newHeight}px`;
  };

  return (
    <div className="p-4 border-t bg-secondary/30 rounded-b-lg">
      <form 
        className="flex gap-2 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <Textarea 
          value={currentMessage}
          onChange={handleTextareaChange}
          placeholder="Ask about this case..."
          className="flex-1 min-h-[48px] max-h-[120px] bg-white dark:bg-card border shadow-sm focus-visible:ring-primary resize-none overflow-y-auto py-3 px-4 rounded-xl"
          disabled={isDisabled}
          style={{ height: '48px' }} // Initial height
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          type="submit"
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || isDisabled}
          className="shrink-0 h-12 w-12 rounded-full shadow-sm"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
