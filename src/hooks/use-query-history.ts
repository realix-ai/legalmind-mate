import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type QueryHistoryItem = {
  id: string;
  text: string;
  timestamp: number;
};

export const useQueryHistory = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);
  const { getUserPrefix } = useAuth();

  // Get the storage key with user prefix
  const getStorageKey = () => {
    return `${getUserPrefix()}queryHistory`;
  };

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(getStorageKey());
    if (savedHistory) {
      try {
        setQueryHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading query history:', error);
        toast.error('Failed to load query history');
      }
    }
  }, [getUserPrefix]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(queryHistory));
  }, [queryHistory, getStorageKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current && 
        !historyRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-history-button="true"]')
      ) {
        setShowHistory(false);
      }
    };

    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHistory]);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const addToHistory = (queryText: string) => {
    if (!queryText.trim()) return;
    
    // Check if the query already exists to avoid duplicates
    const isDuplicate = queryHistory.some(item => item.text === queryText.trim());
    
    if (!isDuplicate) {
      const newHistoryItem: QueryHistoryItem = {
        id: Date.now().toString(),
        text: queryText.trim(),
        timestamp: Date.now()
      };
      
      // Keep the most recent 20 queries
      const updatedHistory = [newHistoryItem, ...queryHistory].slice(0, 20);
      setQueryHistory(updatedHistory);
    }
  };

  const clearHistory = () => {
    setQueryHistory([]);
    toast.success('Query history cleared');
  };

  return {
    queryHistory,
    showHistory,
    historyRef,
    toggleHistory,
    setShowHistory,
    addToHistory,
    clearHistory
  };
};
