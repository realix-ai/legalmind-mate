import { createContext, useContext, useState, ReactNode } from 'react';

interface AiAssistantContextType {
  lastResponses: Array<{id: string, text: string, timestamp: number}>;
  addResponse: (text: string) => void;
  clearResponses: () => void;
}

const AiAssistantContext = createContext<AiAssistantContextType | undefined>(undefined);

export const AiAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [lastResponses, setLastResponses] = useState<Array<{id: string, text: string, timestamp: number}>>([]);

  const addResponse = (text: string) => {
    const newResponse = {
      id: `ai-response-${Date.now()}`,
      text,
      timestamp: Date.now()
    };
    
    setLastResponses(prev => {
      // Keep only the last 5 responses
      const updatedResponses = [newResponse, ...prev];
      return updatedResponses.slice(0, 5);
    });
  };

  const clearResponses = () => {
    setLastResponses([]);
  };

  return (
    <AiAssistantContext.Provider value={{ lastResponses, addResponse, clearResponses }}>
      {children}
    </AiAssistantContext.Provider>
  );
};

export const useAiAssistant = () => {
  const context = useContext(AiAssistantContext);
  if (context === undefined) {
    throw new Error('useAiAssistant must be used within an AiAssistantProvider');
  }
  return context;
};
