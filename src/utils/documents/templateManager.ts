
import { CustomTemplate } from './types';

// Custom templates storage functions
export const saveCustomTemplate = (title: string, description: string, content: string, category: string = "Custom"): CustomTemplate => {
  const customTemplates = getCustomTemplates();
  
  const newTemplate: CustomTemplate = {
    id: `custom-${Date.now()}`,
    title,
    description,
    content,
    category,
    createdAt: Date.now()
  };
  
  customTemplates.push(newTemplate);
  localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
  return newTemplate;
};

export const getCustomTemplates = (): CustomTemplate[] => {
  const saved = localStorage.getItem('customTemplates');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing custom templates', e);
    return [];
  }
};

export const getCustomTemplate = (id: string): CustomTemplate | null => {
  const templates = getCustomTemplates();
  return templates.find(template => template.id === id) || null;
};

export const deleteCustomTemplate = (id: string): void => {
  const customTemplates = getCustomTemplates();
  const filtered = customTemplates.filter(template => template.id !== id);
  localStorage.setItem('customTemplates', JSON.stringify(filtered));
};
