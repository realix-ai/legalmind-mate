
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
      
      // You would typically update the HTML lang attribute
      document.documentElement.setAttribute('lang', language);
      
      // Dispatch a custom event that other components can listen for
      const event = new CustomEvent('languageChanged', { detail: language });
      window.dispatchEvent(event);
    }
  }, [language]);
  
  return { language, setLanguage };
};
