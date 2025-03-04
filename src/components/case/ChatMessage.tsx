
import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} group animate-fade-in`}>
      {sender === 'ai' && (
        <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0 border shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "max-w-[85%] rounded-2xl p-3 shadow-sm transition-all duration-200", 
          sender === 'user' 
            ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-tr-none' 
            : 'bg-secondary/70 dark:bg-secondary/40 backdrop-blur-sm rounded-tl-none'
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        <p className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>
      
      {sender === 'user' && (
        <Avatar className="h-8 w-8 ml-2 mt-1 shrink-0 border shadow-sm">
          <AvatarFallback className="bg-secondary text-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
