
import { useState } from 'react';
import { toast } from "sonner";
import { processLegalQuery, QueryType } from '@/services/legalQueryService';
import { fetchRelatedCitations, Citation } from '@/services/citationService';
import { shareQuery } from '@/services/collaborationService';

export const useLegalQuery = (setActiveTab: (tab: string) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentQueryType, setCurrentQueryType] = useState<QueryType>('legal-research');

  const handleSubmit = async (query: string, selectedOption: QueryType, file: File | null) => {
    setIsProcessing(true);
    setResponse(null);
    setCurrentQuery(query);
    setCurrentQueryType(selectedOption);
    
    try {
      console.log("QueryAssistant: Starting to process query:", query);
      console.log("QueryAssistant: Selected option:", selectedOption);
      console.log("QueryAssistant: File upload has been disabled");
      
      // Always pass null for file since we've removed file upload functionality
      const result = await processLegalQuery(query, selectedOption, null);
      console.log("QueryAssistant: Received result:", result);
      
      if (result.status === 'success') {
        setResponse(result.content);
        toast.success('Query processed successfully');
        
        // Fetch citations related to the query
        const relatedCitations = await fetchRelatedCitations(query);
        setCitations(relatedCitations);
      } else {
        toast.error('Failed to process query: ' + (result.content || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareQuery = () => {
    if (currentQuery && response) {
      const shared = shareQuery(currentQuery, currentQueryType);
      toast.success('Query shared successfully');
      setActiveTab('collaboration');
    } else {
      toast.error('No query results to share');
    }
  };

  return {
    isProcessing,
    response,
    citations,
    currentQuery,
    currentQueryType,
    handleSubmit,
    handleShareQuery
  };
};
