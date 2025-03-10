
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  files?: File[];
}

export interface ChatSession {
  id: string;
  name: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const STORAGE_KEY_PREFIX = 'ai_chat_';
const MAX_CONTEXT_LENGTH = 10;

// Get a list of all chat sessions
export const getChatSessions = (): ChatSession[] => {
  try {
    const sessionsJson = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`);
    if (!sessionsJson) return [];
    return JSON.parse(sessionsJson);
  } catch (error) {
    console.error('Error retrieving chat sessions:', error);
    return [];
  }
};

// Save the list of chat sessions
export const saveChatSessions = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving chat sessions:', error);
  }
};

// Create a new chat session
export const createChatSession = (welcomeMessage?: ChatMessage): ChatSession => {
  const newSession: ChatSession = {
    id: uuidv4(),
    name: `Chat ${new Date().toLocaleString()}`,
    timestamp: new Date(),
    messages: welcomeMessage ? [welcomeMessage] : []
  };
  
  const sessions = getChatSessions();
  sessions.unshift(newSession);
  saveChatSessions(sessions);
  
  return newSession;
};

// Get a specific chat session by ID
export const getChatSession = (sessionId: string): ChatSession | null => {
  const sessions = getChatSessions();
  return sessions.find(session => session.id === sessionId) || null;
};

// Save a specific chat session
export const saveChatSession = (session: ChatSession): void => {
  const sessions = getChatSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  
  saveChatSessions(sessions);
};

// Add a message to a chat session
export const addMessageToSession = (sessionId: string, message: ChatMessage): void => {
  const session = getChatSession(sessionId);
  if (!session) return;
  
  session.messages.push(message);
  session.timestamp = new Date();
  saveChatSession(session);
  
  // Update session list to reflect the new timestamp
  const sessions = getChatSessions();
  const updatedSessions = sessions.map(s => 
    s.id === sessionId ? { ...s, timestamp: new Date() } : s
  );
  
  // Sort by timestamp (newest first)
  updatedSessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  saveChatSessions(updatedSessions);
};

// Rename a chat session
export const renameChatSession = (sessionId: string, newName: string): void => {
  const session = getChatSession(sessionId);
  if (!session) return;
  
  session.name = newName;
  saveChatSession(session);
};

// Delete a chat session
export const deleteChatSession = (sessionId: string): void => {
  const sessions = getChatSessions();
  const updatedSessions = sessions.filter(session => session.id !== sessionId);
  saveChatSessions(updatedSessions);
};

// Get conversation context (most recent messages) for AI
export const getConversationContext = (messages: ChatMessage[]): string => {
  const contextMessages = messages.slice(-MAX_CONTEXT_LENGTH);
  
  return contextMessages.map(msg => {
    const role = msg.isUser ? 'User' : 'Assistant';
    let content = `${role}: ${msg.content}`;
    
    // Add file information if present
    if (msg.files && msg.files.length > 0) {
      content += `\n[Attached ${msg.files.length} file(s): ${msg.files.map(f => f.name).join(', ')}]`;
    }
    
    return content;
  }).join('\n\n');
};

// Get the current or create a new chat session
export const getCurrentOrCreateSession = (): ChatSession => {
  const currentSessionId = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_session_id`);
  
  if (currentSessionId) {
    const session = getChatSession(currentSessionId);
    if (session) return session;
  }
  
  // Create welcome message
  const welcomeMessage: ChatMessage = {
    id: uuidv4(),
    content: "Hello! I'm your legal AI assistant. I can help with legal research, risk analysis, document drafting, summarization, data analysis, and more. How can I assist you today?",
    isUser: false,
    timestamp: new Date()
  };
  
  // Create a new session
  const newSession = createChatSession(welcomeMessage);
  setCurrentSession(newSession.id);
  return newSession;
};

// Set the current active session
export const setCurrentSession = (sessionId: string): void => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}current_session_id`, sessionId);
};

// Extract topics/keywords from messages for better memory indexing
export const extractKeyTopics = (content: string): string[] => {
  // Simple implementation - extract words longer than 4 chars that aren't common words
  const commonWords = ['about', 'after', 'again', 'also', 'because', 'before', 'between', 'could', 'document', 'documents', 'every', 'these', 'thing', 'think', 'those', 'through', 'their', 'there', 'would'];
  
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4 && !commonWords.includes(word));
  
  // Return unique words
  return [...new Set(words)];
};

// Search for relevant past conversations based on a query
export const searchRelevantConversations = (query: string): ChatSession[] => {
  const sessions = getChatSessions();
  const queryTopics = extractKeyTopics(query);
  
  if (queryTopics.length === 0) return [];
  
  // Score sessions based on topic matches
  return sessions
    .map(session => {
      // Get all message content concatenated
      const allContent = session.messages.map(m => m.content).join(' ');
      const sessionTopics = extractKeyTopics(allContent);
      
      // Count matches between query topics and session topics
      const matchCount = queryTopics.filter(topic => 
        sessionTopics.includes(topic)
      ).length;
      
      return {
        session,
        score: matchCount / queryTopics.length
      };
    })
    .filter(item => item.score > 0.3) // Only return sessions with decent relevance
    .sort((a, b) => b.score - a.score) // Sort by relevance score (descending)
    .map(item => item.session);
};
