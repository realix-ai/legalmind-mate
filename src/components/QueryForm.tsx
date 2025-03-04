
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import QueryOptions from '@/components/QueryOptions';
import QueryTextarea from '@/components/QueryTextarea';
import { QueryType } from '@/services/legalQueryService';
import { useFileUpload } from '@/hooks/use-file-upload';
import { usePromptManager } from '@/hooks/use-prompt-manager';
import FileUploadSection from '@/components/query/FileUploadSection';
import PromptManagerSection from '@/components/query/PromptManagerSection';

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
  
  // Use the custom hooks
  const { 
    file, 
    fileError, 
    previewUrl, 
    fileInputRef,
    handleFileChange,
    handleFileDrop,
    clearFile,
    triggerFileUpload
  } = useFileUpload((updateFn) => setQuery(updateFn));
  
  const {
    showPromptManager,
    promptManagerRef,
    togglePromptManager,
    setShowPromptManager
  } = usePromptManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }
    
    if (fileError) {
      toast.error("Please fix the file error before submitting");
      return;
    }
    
    console.log("Submitting form with query:", query);
    console.log("Selected file:", file ? `${file.name} (${file.type})` : "No file selected");
    
    try {
      await onSubmit(query.trim(), selectedOption, file);
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

  return (
    <motion.div variants={itemVariants}>
      <form onSubmit={handleSubmit} className="mb-8">
        <PromptManagerSection 
          showPromptManager={showPromptManager}
          promptManagerRef={promptManagerRef}
          togglePromptManager={togglePromptManager}
          onLoadPrompt={handleLoadPrompt}
        />
        
        <QueryTextarea
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onTriggerFileUpload={triggerFileUpload}
          isProcessing={isProcessing}
          hasFile={!!file}
          fileError={fileError}
          onFileDrop={handleFileDrop}
        />
        
        <FileUploadSection 
          file={file}
          fileError={fileError}
          previewUrl={previewUrl}
          fileInputRef={fileInputRef}
          isProcessing={isProcessing}
          onClearFile={clearFile}
        />
        
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
