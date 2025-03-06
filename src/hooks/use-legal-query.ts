
import { useState } from 'react';
import { toast } from "sonner";
import { processLegalQuery, QueryType } from '@/services/legalQueryService';
import { fetchRelatedCitations, Citation } from '@/services/citationService';
import { shareQuery } from '@/services/collaborationService';
import { ResearchToolType, searchExternalTool } from '@/services/legalResearchToolsService';

export const useLegalQuery = (setActiveTab: (tab: string) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentQueryType, setCurrentQueryType] = useState<QueryType>('legal-research');
  const [currentResearchTool, setCurrentResearchTool] = useState<ResearchToolType | undefined>(undefined);

  const handleSubmit = async (
    query: string, 
    selectedOption: QueryType, 
    files: File[], 
    researchTool?: ResearchToolType
  ) => {
    setIsProcessing(true);
    setResponse(null);
    setCurrentQuery(query);
    setCurrentQueryType(selectedOption);
    setCurrentResearchTool(researchTool);
    
    try {
      console.log("QueryAssistant: Starting to process query:", query);
      console.log("QueryAssistant: Selected option:", selectedOption);
      console.log("QueryAssistant: Research tool:", researchTool || "none");
      
      if (files.length > 0) {
        console.log(`QueryAssistant: Processing with ${files.length} files:`, files.map(f => f.name));
      } else {
        console.log("QueryAssistant: No files uploaded");
      }
      
      // If research tool is selected, open it in a new tab
      if (researchTool) {
        console.log(`QueryAssistant: Using external research tool: ${researchTool}`);
        searchExternalTool(query, researchTool);
        toast.success(`Opened search in ${researchTool}`);
        
        // Still process the query with our system for local results
        const result = await processLegalQuery(query, selectedOption, files);
        if (result.status === 'success') {
          setResponse(result.content + "\n\n*Note: Your query was also opened in " + researchTool + ".*");
          
          // Fetch citations related to the query
          const relatedCitations = await fetchRelatedCitations(query);
          setCitations(relatedCitations);
        } else {
          toast.error('Failed to process query: ' + (result.content || 'Unknown error'));
        }
      } else {
        // Regular processing without external tool
        const result = await processLegalQuery(query, selectedOption, files);
        console.log("QueryAssistant: Received result:", result);
        
        if (result.status === 'success') {
          setResponse(result.content);
          
          // Check if OpenAI API was used
          const isUsingOpenAI = Boolean(localStorage.getItem('openai-api-key'));
          toast.success(isUsingOpenAI ? 'Query processed with ChatGPT' : 'Query processed successfully');
          
          // Fetch citations related to the query
          const relatedCitations = await fetchRelatedCitations(query);
          setCitations(relatedCitations);
        } else {
          toast.error('Failed to process query: ' + (result.content || 'Unknown error'));
        }
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

  const handleResponseEdit = (editedResponse: string) => {
    setResponse(editedResponse);
    // In a real app, you might want to save this edited response to a database
    console.log("Response edited:", editedResponse);
  };

  return {
    isProcessing,
    response,
    citations,
    currentQuery,
    currentQueryType,
    currentResearchTool,
    handleSubmit,
    handleShareQuery,
    handleResponseEdit
  };
};
