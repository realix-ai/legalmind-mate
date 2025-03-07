
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Prompt } from '@/types/prompt';
import { getPrompts, createPrompt, deletePrompt, importPrompts as importPromptsService } from '@/services/promptService';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load prompts when component mounts
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getPrompts();
        if (response.success && response.data) {
          setPrompts(response.data);
        } else {
          setError(response.error || 'Failed to load prompts');
          toast.error('Failed to load saved prompts');
        }
      } catch (err) {
        console.error('Error loading prompts:', err);
        setError('Failed to load prompts');
        toast.error('Failed to load saved prompts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const addPrompt = async (text: string) => {
    if (!text.trim()) {
      toast.error('Prompt text cannot be empty');
      return false;
    }

    try {
      const response = await createPrompt(text);
      if (response.success && response.prompt) {
        setPrompts([...prompts, response.prompt]);
        toast.success('Prompt saved successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to save prompt');
        return false;
      }
    } catch (err) {
      console.error('Error adding prompt:', err);
      toast.error('Failed to save prompt');
      return false;
    }
  };

  const deletePromptById = async (id: string) => {
    try {
      const response = await deletePrompt(id);
      if (response.success) {
        setPrompts(prompts.filter(prompt => prompt.id !== id));
        toast.success('Prompt deleted');
        return true;
      } else {
        toast.error(response.error || 'Failed to delete prompt');
        return false;
      }
    } catch (err) {
      console.error('Error deleting prompt:', err);
      toast.error('Failed to delete prompt');
      return false;
    }
  };

  const importPromptsData = async (promptsData: string) => {
    try {
      const importedPrompts = JSON.parse(promptsData);
      if (Array.isArray(importedPrompts) && importedPrompts.every(p => p.id && p.text)) {
        const response = await importPromptsService(importedPrompts);
        if (response.success && response.data) {
          setPrompts(response.data);
          toast.success('Prompts imported successfully');
          return true;
        } else {
          toast.error(response.error || 'Failed to import prompts');
          return false;
        }
      } else {
        toast.error('Invalid prompts file format');
        return false;
      }
    } catch (error) {
      console.error('Error importing prompts:', error);
      toast.error('Failed to import prompts');
      return false;
    }
  };

  const exportPrompts = () => {
    if (prompts.length === 0) {
      toast.error('No prompts to export');
      return null;
    }
    
    const dataStr = JSON.stringify(prompts, null, 2);
    return dataStr;
  };

  return {
    prompts,
    isLoading,
    error,
    addPrompt,
    deletePrompt: deletePromptById,
    importPrompts: importPromptsData,
    exportPrompts
  };
}
