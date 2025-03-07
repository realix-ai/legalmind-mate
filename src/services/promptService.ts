
import { Prompt, PromptResponse } from '@/types/prompt';
import { toast } from 'sonner';

// Update this to your actual backend API URL
const API_URL = 'https://your-backend-server.com/api';

// Fallback to local storage when API is unavailable
const LOCAL_STORAGE_KEY = 'userPrompts';

// Set this to true to enable API mode
const isApiAvailable = (): boolean => {
  // You can add more sophisticated detection logic here if needed
  return true; // Change to true to enable API mode
}

/**
 * Get all prompts for the user
 */
export const getPrompts = async (): Promise<PromptResponse> => {
  try {
    if (isApiAvailable()) {
      // Real API call with authentication header
      const response = await fetch(`${API_URL}/prompts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } else {
      // Local storage fallback
      const savedPrompts = localStorage.getItem(LOCAL_STORAGE_KEY);
      const prompts = savedPrompts ? JSON.parse(savedPrompts) : [];
      return { success: true, data: prompts };
    }
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    toast.error('Failed to load prompts');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching prompts' 
    };
  }
};

/**
 * Create a new prompt
 */
export const createPrompt = async (text: string): Promise<PromptResponse> => {
  try {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (isApiAvailable()) {
      // Real API call with authentication
      const response = await fetch(`${API_URL}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
        },
        body: JSON.stringify({ text: newPrompt.text }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const createdPrompt = await response.json();
      return { success: true, prompt: createdPrompt };
    } else {
      // Local storage fallback
      const currentPrompts = await getPrompts();
      const updatedPrompts = [...(currentPrompts.data || []), newPrompt];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPrompts));
      return { success: true, prompt: newPrompt };
    }
  } catch (error) {
    console.error('Failed to create prompt:', error);
    toast.error('Failed to save prompt');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error creating prompt' 
    };
  }
};

/**
 * Delete a prompt
 */
export const deletePrompt = async (id: string): Promise<PromptResponse> => {
  try {
    if (isApiAvailable()) {
      // Real API call
      const response = await fetch(`${API_URL}/prompts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return { success: true };
    } else {
      // Local storage fallback
      const currentPrompts = await getPrompts();
      const filteredPrompts = (currentPrompts.data || []).filter(prompt => prompt.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredPrompts));
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to delete prompt:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting prompt' 
    };
  }
};

/**
 * Import prompts (bulk operation)
 */
export const importPrompts = async (prompts: Prompt[]): Promise<PromptResponse> => {
  try {
    if (isApiAvailable()) {
      // Real API call
      const response = await fetch(`${API_URL}/prompts/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompts),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const importedPrompts = await response.json();
      return { success: true, data: importedPrompts };
    } else {
      // Local storage fallback
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prompts));
      return { success: true, data: prompts };
    }
  } catch (error) {
    console.error('Failed to import prompts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error importing prompts' 
    };
  }
};
