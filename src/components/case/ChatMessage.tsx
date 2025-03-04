
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
        <Avatar className="h-8 w-8 mr-2 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "max-w-[85%] rounded-lg p-3", 
          sender === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border border-border/50'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        <p className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>
      
      {sender === 'user' && (
        <Avatar className="h-8 w-8 ml-2 shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
