
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  messages: ChatMessageProps[];
  isAiTyping: boolean;
  onSendMessage: (message: string) => void;
}

const ChatPanel = ({ messages, isAiTyping, onSendMessage }: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
      className="lg:col-span-2 bg-card rounded-lg shadow-md flex flex-col h-[calc(100vh-160px)]"
    >
      <div className="p-4 border-b flex items-center bg-primary/5 rounded-t-lg">
        <div className="bg-primary/10 rounded-full p-2 mr-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Case Assistant</h2>
          <p className="text-xs text-muted-foreground">AI-powered legal assistant</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
        
        {isAiTyping && <TypingIndicator />}
        
        {/* This empty div is used for scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={onSendMessage} isDisabled={isAiTyping} />
    </motion.div>
  );
};

export default ChatPanel;
