
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
    // Save language preference to localStorage when it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-language', language);
      
      // Update the HTML lang attribute using requestAnimationFrame
      // for better performance and UI responsiveness
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('lang', language);
        console.log('Language changed to:', language);
      });
    }
  }, [language]);
  
  return { 
    language, 
    setLanguage: (newLanguage: string) => {
      // Simple direct state update without timeouts
      setLanguage(newLanguage);
    }
  };
};
