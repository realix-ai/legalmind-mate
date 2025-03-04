
import { useState, useRef, useEffect } from 'react';

export const usePromptManager = () => {
  const [showPromptManager, setShowPromptManager] = useState(false);
  const promptManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptManagerRef.current && 
        !promptManagerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-prompt-button="true"]')
      ) {
        setShowPromptManager(false);
      }
    };

    if (showPromptManager) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPromptManager]);

  const togglePromptManager = () => {
    setShowPromptManager(!showPromptManager);
  };

  return {
    showPromptManager,
    promptManagerRef,
    togglePromptManager,
    setShowPromptManager
  };
};
