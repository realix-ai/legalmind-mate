
import React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <Avatar className="h-8 w-8 mr-2 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-card border border-border/50 rounded-lg p-3">
        <div className="flex space-x-1 items-center h-5">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
