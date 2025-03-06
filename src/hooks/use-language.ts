
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
      
      // Update the HTML lang attribute
      document.documentElement.setAttribute('lang', language);
      
      // Use a safer way to notify about language changes - using a timeout
      // to ensure the UI doesn't freeze
      setTimeout(() => {
        const event = new CustomEvent('languageChanged', { detail: language });
        window.dispatchEvent(event);
        console.log('Language changed to:', language);
      }, 0);
    }
  }, [language]);
  
  return { language, setLanguage };
};
