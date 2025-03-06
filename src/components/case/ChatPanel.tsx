
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, PanelLeft, PanelLeftClose } from 'lucide-react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatPanelProps {
  messages: ChatMessageProps[];
  isAiTyping: boolean;
  onSendMessage: (message: string, files?: File[]) => void;
  onNewDialog: () => void;
  showDocumentPanel?: boolean;
  toggleDocumentPanel?: () => void;
}

const ChatPanel = ({ 
  messages, 
  isAiTyping, 
  onSendMessage, 
  onNewDialog, 
  showDocumentPanel = true,
  toggleDocumentPanel
}: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
      className="border rounded-lg flex flex-col h-[calc(100vh-160px)]"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-primary/10 rounded-full p-2 mr-3">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Case Assistant</h2>
        </div>
        
        {toggleDocumentPanel && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleDocumentPanel}
                  className="ml-auto"
                >
                  {showDocumentPanel ? (
                    <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <PanelLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{showDocumentPanel ? 'Hide document panel' : 'Show document panel'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
        
        {isAiTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} className="h-2" />
      </div>
      
      <ChatInput 
        onSendMessage={onSendMessage} 
        isDisabled={isAiTyping} 
        messages={messages} 
        onNewDialog={onNewDialog}
      />
    </motion.div>
  );
};

export default ChatPanel;
