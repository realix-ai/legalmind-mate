
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { ChatSession } from './types';

// Get stored chat messages for a specific case and session
export const getChatMessages = (caseId: string, sessionId?: string): ChatMessageProps[] => {
  // If a sessionId is provided, try to get messages for that session first
  if (sessionId) {
    const sessionMessages = localStorage.getItem(`chat_${caseId}_${sessionId}`);
    if (sessionMessages) {
      try {
        return JSON.parse(sessionMessages);
      } catch (e) {
        console.error('Error parsing session chat messages', e);
      }
    }
  }
  
  // Fall back to the main chat storage
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
export const saveChatMessages = (caseId: string, messages: ChatMessageProps[], sessionId?: string): void => {
  // Always save to the main storage
  localStorage.setItem(`chat_${caseId}`, JSON.stringify(messages));
  
  // If a sessionId is provided, also save to that session storage
  if (sessionId) {
    localStorage.setItem(`chat_${caseId}_${sessionId}`, JSON.stringify(messages));
    
    // Update the sessions list
    updateSessionsList(caseId, sessionId, messages[0]?.timestamp || Date.now());
  }
};

// Add a single message to the chat history
export const addChatMessage = (caseId: string, message: ChatMessageProps, sessionId?: string): ChatMessageProps[] => {
  const messages = getChatMessages(caseId, sessionId);
  const updatedMessages = [...messages, message];
  saveChatMessages(caseId, updatedMessages, sessionId);
  return updatedMessages;
};

// Clear chat history for a specific case
export const clearChatHistory = (caseId: string): void => {
  // Clear main chat storage
  localStorage.removeItem(`chat_${caseId}`);
  
  // Clear all sessions for this case
  const sessions = getSessionsList(caseId);
  sessions.forEach(session => {
    localStorage.removeItem(`chat_${caseId}_${session.id}`);
  });
  
  // Clear sessions list
  localStorage.removeItem(`chat_sessions_${caseId}`);
};

// Get the list of sessions for a case
export const getSessionsList = (caseId: string): ChatSession[] => {
  const savedSessions = localStorage.getItem(`chat_sessions_${caseId}`);
  if (!savedSessions) return [];
  
  try {
    return JSON.parse(savedSessions);
  } catch (e) {
    console.error('Error parsing sessions list', e);
    return [];
  }
};

// Update the sessions list for a case
const updateSessionsList = (caseId: string, sessionId: string, timestamp: number): void => {
  const sessions = getSessionsList(caseId);
  
  // Check if session already exists
  const existingSessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (existingSessionIndex >= 0) {
    // Update existing session
    sessions[existingSessionIndex].timestamp = timestamp;
  } else {
    // Add new session
    sessions.push({ id: sessionId, timestamp });
  }
  
  // Sort sessions by timestamp (newest first)
  sessions.sort((a, b) => b.timestamp - a.timestamp);
  
  // Save updated sessions list
  localStorage.setItem(`chat_sessions_${caseId}`, JSON.stringify(sessions));
};
