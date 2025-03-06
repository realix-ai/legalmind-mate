
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export const OpenAiStatusBadge = () => {
  const [isUsingOpenAI, setIsUsingOpenAI] = useState(false);
  
  useEffect(() => {
    // Check if OpenAI API is configured
    setIsUsingOpenAI(Boolean(localStorage.getItem('openai-api-key')));
    
    // Listen for storage changes to update badge in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openai-api-key') {
        setIsUsingOpenAI(Boolean(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  if (!isUsingOpenAI) return null;
  
  return (
    <Badge variant="outline" className="gap-1">
      <MessageSquare className="h-4 w-4" />
      ChatGPT Enabled
    </Badge>
  );
};

export default OpenAiStatusBadge;
