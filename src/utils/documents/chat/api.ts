
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { ChatSession } from './types';

const API_URL = 'https://api.realix.example/v1';

// Helper to check if we're in API mode or local storage mode
const isApiAvailable = (): boolean => {
  // For development, we'll use a feature flag to toggle API mode
  // In production, you might check for API connectivity
  return false;
}

// Fetch chat messages from the API
export const fetchChatMessages = async (caseId: string, sessionId?: string): Promise<ChatMessageProps[]> => {
  if (!isApiAvailable()) {
    return []; // Fall back to local storage
  }

  try {
    const endpoint = sessionId 
      ? `${API_URL}/cases/${caseId}/sessions/${sessionId}/messages` 
      : `${API_URL}/cases/${caseId}/messages`;
    
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};

// Save chat messages to the API
export const saveChatMessagesToApi = async (
  caseId: string, 
  messages: ChatMessageProps[], 
  sessionId?: string
): Promise<boolean> => {
  if (!isApiAvailable()) {
    return false; // Fall back to local storage
  }

  try {
    const endpoint = sessionId 
      ? `${API_URL}/cases/${caseId}/sessions/${sessionId}/messages` 
      : `${API_URL}/cases/${caseId}/messages`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error saving chat messages:', error);
    return false;
  }
};

// Add a message to the chat history via API
export const addChatMessageToApi = async (
  caseId: string, 
  message: ChatMessageProps, 
  sessionId?: string
): Promise<boolean> => {
  if (!isApiAvailable()) {
    return false; // Fall back to local storage
  }

  try {
    const endpoint = sessionId 
      ? `${API_URL}/cases/${caseId}/sessions/${sessionId}/messages` 
      : `${API_URL}/cases/${caseId}/messages`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error adding chat message:', error);
    return false;
  }
};

// Clear chat history via API
export const clearChatHistoryApi = async (caseId: string): Promise<boolean> => {
  if (!isApiAvailable()) {
    return false; // Fall back to local storage
  }

  try {
    const response = await fetch(`${API_URL}/cases/${caseId}/messages`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
};

// Get sessions list via API
export const fetchSessionsList = async (caseId: string): Promise<ChatSession[]> => {
  if (!isApiAvailable()) {
    return []; // Fall back to local storage
  }

  try {
    const response = await fetch(`${API_URL}/cases/${caseId}/sessions`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sessions list:', error);
    return [];
  }
};
