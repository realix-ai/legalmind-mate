
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import QueryOptions from '@/components/QueryOptions';
import QueryTextarea from '@/components/QueryTextarea';
import { QueryType } from '@/services/legalQueryService';
import { usePromptManager } from '@/hooks/use-prompt-manager';
import { useQueryHistory } from '@/hooks/use-query-history';
import PromptManagerSection from '@/components/query/PromptManagerSection';
import QueryHistory from '@/components/query/QueryHistory';

interface QueryFormProps {
  onSubmit: (query: string, queryType: QueryType, file: File | null) => Promise<void>;
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
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
      
      await onSubmit(query.trim(), selectedOption, uploadedFile);
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

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setFileError("File size exceeds the limit of 10MB");
          setUploadedFile(null);
          toast.error("File size exceeds the limit of 10MB");
          return;
        }
        
        // Check file type
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          setFileError("Unsupported file type. Please upload PDF, Word, or Text files");
          setUploadedFile(null);
          toast.error("Unsupported file type");
          return;
        }
        
        // File is valid
        setFileError(null);
        setUploadedFile(file);
        toast.success(`File uploaded: ${file.name}`);
      }
    };
    
    input.click();
  };

  return (
    <motion.div variants={itemVariants}>
      <form onSubmit={handleSubmit} className="mb-8">
        <QueryTextarea
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onTriggerFileUpload={handleFileUpload}
          isProcessing={isProcessing}
          hasFile={!!uploadedFile}
          fileError={fileError}
        />
        
        {uploadedFile && (
          <div className="mb-4 p-2 bg-muted rounded-md flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">File:</span> {uploadedFile.name}
            </div>
            <button
              type="button"
              className="text-sm text-destructive hover:underline"
              onClick={() => {
                setUploadedFile(null);
                setFileError(null);
              }}
            >
              Remove
            </button>
          </div>
        )}
        
        <PromptManagerSection 
          showPromptManager={showPromptManager}
          promptManagerRef={promptManagerRef}
          togglePromptManager={togglePromptManager}
          onLoadPrompt={handleLoadPrompt}
          onHistoryClick={toggleHistory}
        />
        
        {showHistory && (
          <div 
            ref={historyRef}
            className="relative z-10 w-72 shadow-md mb-4"
          >
            <QueryHistory 
              history={queryHistory} 
              onSelectQuery={handleSelectHistory} 
              onClearHistory={clearHistory}
            />
          </div>
        )}
        
        <p className="text-sm font-medium mb-2">Select analysis type:</p>
        <QueryOptions
          onSelect={(option) => setSelectedOption(option as QueryType)}
          selectedOption={selectedOption}
        />
      </form>
    </motion.div>
  );
};

export default QueryForm;
