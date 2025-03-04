
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { LegalResearchResult, SearchHistoryItem } from '@/types/legalResearch';
import { useNotifications } from '@/hooks/useNotifications';

type ResearchTool = 'westlaw' | 'lexisnexis' | 'googlescholar';

// Mock API function to simulate search results
const mockSearchApi = (query: string, source: ResearchTool): Promise<LegalResearchResult[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const count = Math.floor(Math.random() * 10) + 1; // 1-10 results
      const results: LegalResearchResult[] = [];
      
      for (let i = 0; i < count; i++) {
        results.push({
          id: uuidv4(),
          title: `${source === 'westlaw' ? 'Westlaw' : source === 'lexisnexis' ? 'LexisNexis' : 'Scholar'} Result: ${query} - ${i + 1}`,
          citation: `123 U.S. ${Math.floor(Math.random() * 1000) + 1} (${Math.floor(Math.random() * 100) + 1920})`,
          snippet: `This case discusses aspects related to "${query}" and its implications in legal practice. The court found that the defendant had...`,
          url: `https://example.com/${source}/article-${i}`,
          source: source === 'westlaw' ? 'Westlaw' : source === 'lexisnexis' ? 'LexisNexis' : 'Google Scholar',
          date: format(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 10), 'MMM d, yyyy'),
          type: Math.random() > 0.5 ? 'case' : 'statute'
        });
      }
      
      resolve(results);
    }, 1500);
  });
};

export const useLegalResearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LegalResearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedResults, setSavedResults] = useState<LegalResearchResult[]>([]);
  const { addNotification } = useNotifications();
  
  // Load saved results and search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('legal_search_history');
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Error parsing search history', e);
      }
    }
    
    const storedSaved = localStorage.getItem('legal_saved_results');
    if (storedSaved) {
      try {
        setSavedResults(JSON.parse(storedSaved));
      } catch (e) {
        console.error('Error parsing saved results', e);
      }
    }
  }, []);
  
  const performSearch = useCallback(async (query: string, source: ResearchTool) => {
    setIsLoading(true);
    
    try {
      const searchResults = await mockSearchApi(query, source);
      setResults(searchResults);
      
      // Add to search history
      const historyItem: SearchHistoryItem = {
        id: uuidv4(),
        query,
        source,
        date: format(new Date(), 'MMM d, yyyy'),
        timestamp: Date.now(),
        resultCount: searchResults.length
      };
      
      const updatedHistory = [historyItem, ...searchHistory].slice(0, 20); // Keep only 20 most recent searches
      setSearchHistory(updatedHistory);
      localStorage.setItem('legal_search_history', JSON.stringify(updatedHistory));
      
      // Create notification
      addNotification({
        type: 'system',
        title: 'Research Results Ready',
        message: `Your ${source} search for "${query}" returned ${searchResults.length} results`,
      });
      
    } catch (error) {
      console.error('Error performing search', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchHistory, addNotification]);
  
  const saveResult = useCallback((result: LegalResearchResult) => {
    // Check if already saved
    if (savedResults.some(r => r.id === result.id)) {
      return;
    }
    
    const updatedSaved = [result, ...savedResults];
    setSavedResults(updatedSaved);
    localStorage.setItem('legal_saved_results', JSON.stringify(updatedSaved));
    
    // Create notification
    addNotification({
      type: 'document',
      title: 'Research Item Saved',
      message: `You saved "${result.title}" to your research collection`,
    });
  }, [savedResults, addNotification]);
  
  const removeFromSaved = useCallback((id: string) => {
    const updatedSaved = savedResults.filter(result => result.id !== id);
    setSavedResults(updatedSaved);
    localStorage.setItem('legal_saved_results', JSON.stringify(updatedSaved));
  }, [savedResults]);
  
  return {
    isLoading,
    results,
    searchHistory,
    savedResults,
    performSearch,
    saveResult,
    removeFromSaved
  };
};
