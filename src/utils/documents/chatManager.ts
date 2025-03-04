
import { ChatMessageProps } from '@/components/case/ChatMessage';

// Get stored chat messages for a specific case
export const getChatMessages = (caseId: string): ChatMessageProps[] => {
  const savedMessages = localStorage.getItem(`chat_${caseId}`);
  if (!savedMessages) return [];
  
  try {
    return JSON.parse(savedMessages);
  } catch (e) {
    console.error('Error parsing chat messages', e);
    return [];
  }
};

// Save chat messages for a specific case
export const saveChatMessages = (caseId: string, messages: ChatMessageProps[]): void => {
  localStorage.setItem(`chat_${caseId}`, JSON.stringify(messages));
};

// Add a single message to the chat history
export const addChatMessage = (caseId: string, message: ChatMessageProps): ChatMessageProps[] => {
  const messages = getChatMessages(caseId);
  const updatedMessages = [...messages, message];
  saveChatMessages(caseId, updatedMessages);
  return updatedMessages;
};

// Clear chat history for a specific case
export const clearChatHistory = (caseId: string): void => {
  localStorage.removeItem(`chat_${caseId}`);
};

// Generate a welcome message based on case data
export const generateWelcomeMessage = (caseName: string): ChatMessageProps => {
  return {
    id: `msg-${Date.now()}`,
    content: `Welcome to case "${caseName}". How can I assist you with this case today?`,
    sender: 'ai',
    timestamp: Date.now()
  };
};
