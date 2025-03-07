
import { Prompt, PromptResponse } from '@/types/prompt';

// API base URL - in a real app, this would be your API endpoint
const API_URL = 'https://api.realix.example/v1';

// Fallback to local storage when API is unavailable
const LOCAL_STORAGE_KEY = 'userPrompts';

// Helper to check if we're in API mode or local storage mode
const isApiAvailable = (): boolean => {
  // For development, we'll use a feature flag to toggle API mode
  // In production, you might check for API connectivity
  return false;
}

/**
 * Get all prompts for the user
 */
export const getPrompts = async (): Promise<PromptResponse> => {
  try {
    if (isApiAvailable()) {
      // Real API call
      const response = await fetch(`${API_URL}/prompts`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
      // Real API call
      const response = await fetch(`${API_URL}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
