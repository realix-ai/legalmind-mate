
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { MAX_CONTEXT_LENGTH } from './types';

// Get conversation context (last N messages) for AI generation
export const getConversationContext = (messages: ChatMessageProps[]): string => {
  // Get the last MAX_CONTEXT_LENGTH messages for context
  const contextMessages = messages.slice(-MAX_CONTEXT_LENGTH);
  
  // Format them into a single string for context
  return contextMessages.map(msg => {
    const role = msg.sender === 'user' ? 'User' : 'Assistant';
    let message = `${role}: ${msg.content}`;
    
    // Add file information if present
    if (msg.files && msg.files.length > 0) {
      message += `\n[Attached ${msg.files.length} file(s): ${msg.files.map(f => f.name).join(', ')}]`;
    }
    
    return message;
  }).join('\n\n');
};

// Generate a welcome message based on case data
export const generateWelcomeMessage = (caseName: string): ChatMessageProps => {
  return {
    id: `msg-${Date.now()}`,
    content: `Welcome to case "${caseName}". I have access to all documents associated with this case. How can I assist you today?`,
    sender: 'ai',
    timestamp: Date.now()
  };
};
