
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
import GetFromIManageDialog from '@/components/document/GetFromIManageDialog';

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
  const [selectedResearchTool, setSelectedResearchTool] = useState<ResearchToolType>('none');
  
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
      if (selectedResearchTool !== 'none' && 
          !isToolConfigured(selectedResearchTool) && 
          selectedResearchTool !== 'googlescholar') {
        toast.error(`Please configure ${selectedResearchTool} first in the Research Tools tab`);
        return;
      }
      
      // Only pass the research tool if it's not 'none'
      const toolToUse = selectedResearchTool !== 'none' 
        ? selectedResearchTool 
        : undefined;
      
      await onSubmit(query.trim(), selectedOption, uploadedFiles, toolToUse);
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

  const handleDocumentSelected = (document: any) => {
    // Update the query to reference the selected document
    setQuery(prevQuery => {
      const prefix = prevQuery.trim() ? `${prevQuery}\n\nReferencing document: ` : `Referencing document: `;
      return `${prefix}${document.title}`;
    });

    // You could also add the document content to the query if needed
    // For large documents, it's better to just mention the document and
    // have your backend process reference it
    toast.success(`Document "${document.title}" referenced in your query`);
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
        
        <div className="flex flex-wrap gap-2 mb-4">
          <GetFromIManageDialog 
            onDocumentSelected={handleDocumentSelected}
            buttonSize="sm"
          />
        </div>
        
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
