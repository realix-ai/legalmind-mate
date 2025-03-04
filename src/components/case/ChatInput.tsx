
import React, { useState, useRef, useEffect } from 'react';
import { Send, List, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePrompts } from '@/hooks/use-prompts';
import { useQueryHistory } from '@/hooks/use-query-history';
import PromptManagerSection from '@/components/query/PromptManagerSection';
import QueryHistory from '@/components/query/QueryHistory';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const ChatInput = ({ onSendMessage, isDisabled }: ChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Prompt manager state and hooks
  const { 
    showPromptManager, 
    promptManagerRef, 
    togglePromptManager 
  } = usePromptManager();
  
  // Query history state and hooks
  const {
    queryHistory,
    showHistory,
    historyRef,
    toggleHistory,
    addToHistory,
    clearHistory
  } = useQueryHistory();

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add to history
    addToHistory(currentMessage);
    
    // Send message
    onSendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleLoadPrompt = (promptText: string) => {
    setCurrentMessage(promptText);
    togglePromptManager();
  };
  
  const handleSelectHistoryQuery = (queryText: string) => {
    setCurrentMessage(queryText);
    toggleHistory();
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
      <PromptManagerSection
        showPromptManager={showPromptManager}
        promptManagerRef={promptManagerRef}
        togglePromptManager={togglePromptManager}
        onLoadPrompt={handleLoadPrompt}
        onHistoryClick={toggleHistory}
      />
      
      {showHistory && (
        <div ref={historyRef} className="relative z-10 w-72 shadow-md mb-4">
          <QueryHistory 
            history={queryHistory}
            onSelectQuery={handleSelectHistoryQuery}
            onClearHistory={clearHistory}
          />
        </div>
      )}
      
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
