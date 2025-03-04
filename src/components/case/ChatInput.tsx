import React, { useState, useRef, useEffect } from 'react';
import { Send, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePrompts } from '@/hooks/use-prompts';
import PromptManagerSection from '@/components/query/PromptManagerSection';
import { ChatMessageProps } from '@/components/case/ChatMessage';
import ChatHistory from '@/components/case/ChatHistory';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
  messages: ChatMessageProps[];
}

const ChatInput = ({ onSendMessage, isDisabled, messages }: ChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Prompt manager state and hooks
  const { 
    showPromptManager, 
    promptManagerRef, 
    togglePromptManager 
  } = usePromptManager();
  
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Send message
    onSendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleLoadPrompt = (promptText: string) => {
    setCurrentMessage(promptText);
    togglePromptManager();
  };
  
  const handleSelectHistoryMessage = (messageText: string) => {
    setCurrentMessage(messageText);
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
    <div className="p-4 border-t bg-gradient-to-b from-background to-accent/10 rounded-b-xl">
      <PromptManagerSection
        showPromptManager={showPromptManager}
        promptManagerRef={promptManagerRef}
        togglePromptManager={togglePromptManager}
        onLoadPrompt={handleLoadPrompt}
        onHistoryClick={() => {}}
      />
      
      <div className="flex gap-3 items-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-background"
              data-history-button="true"
            >
              <History className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <ChatHistory 
              messages={messages}
              onSelectMessage={handleSelectHistoryMessage}
            />
          </PopoverContent>
        </Popover>
        
        <Textarea 
          value={currentMessage}
          onChange={handleTextareaChange}
          placeholder="Type a new message or select from history..."
          className="flex-1 min-h-[48px] max-h-[120px] bg-background border shadow-sm focus-visible:ring-primary resize-none overflow-y-auto py-3 px-4 rounded-xl"
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
          className="h-12 w-12 rounded-full shadow-sm"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// Create a local hook for managing prompt visibility
const usePromptManager = () => {
  const [showPromptManager, setShowPromptManager] = useState(false);
  const promptManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptManagerRef.current && 
        !promptManagerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-prompt-button="true"]')
      ) {
        setShowPromptManager(false);
      }
    };

    if (showPromptManager) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPromptManager]);

  const togglePromptManager = () => {
    setShowPromptManager(!showPromptManager);
  };

  return {
    showPromptManager,
    promptManagerRef,
    togglePromptManager,
    setShowPromptManager
  };
};

export default ChatInput;
