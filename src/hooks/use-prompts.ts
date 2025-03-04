
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Prompt } from '@/types/prompt';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  
  // Load prompts from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('userPrompts');
    if (savedPrompts) {
      try {
        setPrompts(JSON.parse(savedPrompts));
      } catch (error) {
        console.error('Error loading prompts:', error);
        toast.error('Failed to load saved prompts');
      }
    }
  }, []);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPrompts', JSON.stringify(prompts));
  }, [prompts]);

  const addPrompt = (text: string) => {
    if (!text.trim()) {
      toast.error('Prompt text cannot be empty');
      return false;
    }

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text: text.trim()
    };

    setPrompts([...prompts, newPrompt]);
    toast.success('Prompt saved successfully');
    return true;
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
    toast.success('Prompt deleted');
  };

  const importPrompts = (promptsData: string) => {
    try {
      const importedPrompts = JSON.parse(promptsData);
      if (Array.isArray(importedPrompts) && importedPrompts.every(p => p.id && p.text)) {
        setPrompts(importedPrompts);
        toast.success('Prompts imported successfully');
        return true;
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
    addPrompt,
    deletePrompt,
    importPrompts,
    exportPrompts
  };
}
