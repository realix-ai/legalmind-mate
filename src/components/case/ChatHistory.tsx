
import React from 'react';
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
    <div className="border rounded-lg bg-card shadow-md">
      <h3 className="text-sm font-medium p-3 border-b">Previous Messages</h3>
      
      {userMessages.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground py-2 italic">No previous conversations</p>
          <p className="text-xs text-muted-foreground">Start a new conversation by typing a message below</p>
        </div>
      ) : (
        <ul className="max-h-60 overflow-y-auto">
          {userMessages.map(message => (
            <li 
              key={message.id}
              className="p-3 hover:bg-accent/30 border-b last:border-b-0 cursor-pointer transition-colors"
              onClick={() => onSelectMessage(message.content)}
            >
              <div className="text-sm truncate">{message.content}</div>
              <div className="text-xs text-muted-foreground mt-1">
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
