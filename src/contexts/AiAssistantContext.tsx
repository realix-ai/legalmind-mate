import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Response {
  id: string;
  text: string;
  timestamp: number;
  topics?: string[];
}

interface AiAssistantContextType {
  lastResponses: Response[];
  addResponse: (text: string) => void;
  clearResponses: () => void;
  getRelatedResponses: (query: string) => Response[];
}

const AiAssistantContext = createContext<AiAssistantContextType | undefined>(undefined);

// Helper to extract topics from a text
const extractTopics = (text: string): string[] => {
  // Remove common punctuation and split by spaces
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);
  
  // Filter out common words and short words
  const commonWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were'];
  const topics = words.filter(word => 
    word.length > 3 && !commonWords.includes(word)
  );
  
  // Return unique topics
  return [...new Set(topics)];
};

// Simple search function that finds similarity between topics
const findRelevantResponses = (query: string, responses: Response[]): Response[] => {
  const queryTopics = extractTopics(query);
  
  if (queryTopics.length === 0) return [];
  
  return responses
    .map(response => {
      const matchCount = (response.topics || []).filter(topic => 
        queryTopics.includes(topic)
      ).length;
      
      return {
        response,
        score: matchCount / Math.max(queryTopics.length, 1)
      };
    })
    .filter(item => item.score > 0.2) // Only return with some relevance
    .sort((a, b) => b.score - a.score) // Sort by relevance
    .map(item => item.response);
};

export const AiAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [lastResponses, setLastResponses] = useState<Response[]>([]);

  // Load saved responses from localStorage on mount
  useEffect(() => {
    try {
      const savedResponses = localStorage.getItem('ai-assistant-responses');
      if (savedResponses) {
        const parsedResponses = JSON.parse(savedResponses);
        if (Array.isArray(parsedResponses)) {
          setLastResponses(parsedResponses);
        }
      }
    } catch (error) {
      console.error('Error loading saved responses:', error);
    }
  }, []);

  // Save responses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ai-assistant-responses', JSON.stringify(lastResponses));
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  }, [lastResponses]);

  const addResponse = (text: string) => {
    const topics = extractTopics(text);
    
    const newResponse: Response = {
      id: `ai-response-${Date.now()}`,
      text,
      timestamp: Date.now(),
      topics
    };
    
    setLastResponses(prev => {
      // Keep only the last 20 responses to prevent localStorage from getting too large
      const updatedResponses = [newResponse, ...prev];
      return updatedResponses.slice(0, 20);
    });
  };

  const clearResponses = () => {
    setLastResponses([]);
    localStorage.removeItem('ai-assistant-responses');
  };

  const getRelatedResponses = (query: string): Response[] => {
    return findRelevantResponses(query, lastResponses);
  };

  return (
    <AiAssistantContext.Provider value={{ lastResponses, addResponse, clearResponses, getRelatedResponses }}>
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
