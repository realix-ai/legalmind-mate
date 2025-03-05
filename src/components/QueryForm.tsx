
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import QueryOptions from '@/components/QueryOptions';
import QueryTextarea from '@/components/QueryTextarea';
import { QueryType } from '@/services/legalQueryService';
import { usePromptManager } from '@/hooks/use-prompt-manager';
import { useQueryHistory } from '@/hooks/use-query-history';
import { ResearchToolType, isToolConfigured } from '@/services/legalResearchToolsService';
import PromptManagerSection from '@/components/query/PromptManagerSection';
import QueryHistoryView from '@/components/query/QueryHistoryView';
import FileUploadSection from '@/components/query/FileUploadSection';
import ResearchToolSelector from '@/components/query/ResearchToolSelector';
import { useFileHandler } from '@/hooks/use-file-handler';

interface QueryFormProps {
  onSubmit: (query: string, queryType: QueryType, files: File[], researchTool?: ResearchToolType) => Promise<void>;
  isProcessing: boolean;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const QueryForm = ({ onSubmit, isProcessing }: QueryFormProps) => {
  const [query, setQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<QueryType>('legal-research');
  const [selectedResearchTool, setSelectedResearchTool] = useState<ResearchToolType | ''>('');
  
  const {
    uploadedFiles,
    setUploadedFiles,
    fileError,
    setFileError,
    handleFileUpload
  } = useFileHandler();
  
  const {
    showPromptManager,
    promptManagerRef,
    togglePromptManager,
    setShowPromptManager
  } = usePromptManager();
  
  const {
    queryHistory,
    showHistory,
    historyRef,
    toggleHistory,
    setShowHistory,
    addToHistory,
    clearHistory
  } = useQueryHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }
    
    console.log("Submitting form with query:", query);
    
    try {
      // Add query to history
      addToHistory(query);
      
      // If research tool is selected but not configured, show error
      if (selectedResearchTool && !isToolConfigured(selectedResearchTool) && selectedResearchTool !== 'googlescholar') {
        toast.error(`Please configure ${selectedResearchTool} first in the Research Tools tab`);
        return;
      }
      
      await onSubmit(query.trim(), selectedOption, uploadedFiles, selectedResearchTool || undefined);
      console.log("Form submission completed");
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Error submitting query");
    }
  };

  const handleLoadPrompt = (promptText: string) => {
    setQuery(promptText);
    setShowPromptManager(false); // Hide prompt manager after selection
  };
  
  const handleSelectHistory = (historyText: string) => {
    setQuery(historyText);
    setShowHistory(false); // Hide history after selection
  };

  return (
    <motion.div variants={itemVariants}>
      <form onSubmit={handleSubmit} className="mb-8">
        <QueryTextarea
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onTriggerFileUpload={handleFileUpload}
          isProcessing={isProcessing}
          hasFiles={uploadedFiles.length > 0}
          fileError={fileError}
        />
        
        <FileUploadSection 
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          setFileError={setFileError}
        />
        
        <PromptManagerSection 
          showPromptManager={showPromptManager}
          promptManagerRef={promptManagerRef}
          togglePromptManager={togglePromptManager}
          onLoadPrompt={handleLoadPrompt}
          onHistoryClick={toggleHistory}
        />
        
        <QueryHistoryView 
          showHistory={showHistory}
          historyRef={historyRef}
          queryHistory={queryHistory}
          onSelectQuery={handleSelectHistory}
          clearHistory={clearHistory}
        />
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Select analysis type:</p>
            <QueryOptions
              onSelect={(option) => setSelectedOption(option as QueryType)}
              selectedOption={selectedOption}
            />
          </div>
          
          {selectedOption === 'legal-research' && (
            <ResearchToolSelector 
              selectedTool={selectedResearchTool} 
              onToolSelect={setSelectedResearchTool} 
            />
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default QueryForm;
