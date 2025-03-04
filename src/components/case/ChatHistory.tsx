
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChatMessageProps } from './ChatMessage';

interface ChatHistoryProps {
  messages: ChatMessageProps[];
  onSelectMessage: (messageText: string) => void;
}

const ChatHistory = ({ messages, onSelectMessage }: ChatHistoryProps) => {
  // Filter to only show user messages - we don't want to reuse AI messages
  const userMessages = messages.filter(message => message.sender === 'user');
  
  return (
    <div className="p-3 border bg-card/95 backdrop-blur-sm rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <h3 className="text-sm font-medium text-foreground">Previous Messages</h3>
      </div>
      
      {userMessages.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2 italic">No chat history yet</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto space-y-1 pr-1">
          {userMessages.map(message => (
            <li 
              key={message.id}
              className="text-xs p-2 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors duration-150"
              onClick={() => onSelectMessage(message.content)}
            >
              <div className="truncate font-medium">{message.content}</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {format(new Date(message.timestamp), 'MMM d, h:mm a')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;
