
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { ChatSession } from './types';
import { toast } from 'sonner';

// Update this to your actual backend API URL
const API_URL = 'https://your-backend-server.com/api';

// Set this to true to enable API mode
const isApiAvailable = (): boolean => {
  // You can add more sophisticated detection logic here if needed
  // For example, checking connection status or feature flags
  return true; // Change to true to enable API mode
}

// Helper to handle API response errors
const handleApiError = (error: any, fallbackMessage: string): never => {
  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  console.error(errorMessage, error);
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

// Fetch chat messages from the API
export const fetchChatMessages = async (caseId: string, sessionId?: string): Promise<ChatMessageProps[]> => {
  if (!isApiAvailable()) {
    return []; // Fall back to local storage
  }

  try {
    const endpoint = sessionId 
      ? `${API_URL}/cases/${caseId}/sessions/${sessionId}/messages` 
      : `${API_URL}/cases/${caseId}/messages`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // Log the error but don't throw - this allows fallback to local storage
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
        'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
      },
      body: JSON.stringify(messages),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return true;
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
        'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
      },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return true;
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return true;
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
    const response = await fetch(`${API_URL}/cases/${caseId}/sessions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sessions list:', error);
    return [];
  }
};
