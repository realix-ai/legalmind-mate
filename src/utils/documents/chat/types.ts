import { ChatMessageProps, ChatFileAttachment } from '@/components/case/ChatMessage';

// Maximum number of messages to keep in conversation context
export const MAX_CONTEXT_LENGTH = 10;

// Session type for chat history
export interface ChatSession {
  id: string;
  timestamp: number;
}
