
import { useState, useEffect } from 'react';

type Language = string;

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('app-language');
      return savedLanguage || 'en';
    }
    return 'en'; // Default to English
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Separate the storage operation from the DOM manipulation
      localStorage.setItem('app-language', language);
      
      // Do DOM operations in next animation frame to avoid blocking
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('lang', language);
      });
    }
  }, [language]);
  
  return { 
    language, 
    setLanguage 
  };
};
