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
import { ResearchToolType, researchTools, isToolConfigured } from '@/services/legalResearchToolsService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedResearchTool, setSelectedResearchTool] = useState<ResearchToolType | ''>('');
  
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

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.multiple = true;
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const newFiles: File[] = Array.from(target.files);
        const MAX_FILES = 5;
        
        // Check number of files
        if (newFiles.length > MAX_FILES) {
          setFileError(`You can only upload up to ${MAX_FILES} files at once`);
          toast.error(`You can only upload up to ${MAX_FILES} files at once`);
          return;
        }
        
        // Check each file for size and type
        let hasError = false;
        for (const file of newFiles) {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            setFileError(`File ${file.name} exceeds the limit of 10MB`);
            toast.error(`File ${file.name} exceeds the limit of 10MB`);
            hasError = true;
            break;
          }
          
          // Check file type
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
          ];
          
          if (!allowedTypes.includes(file.type)) {
            setFileError(`File ${file.name} has an unsupported type. Please upload PDF, Word, or Text files`);
            toast.error(`Unsupported file type: ${file.name}`);
            hasError = true;
            break;
          }
        }
        
        if (hasError) {
          setUploadedFiles([]);
          return;
        }
        
        // Files are valid
        setFileError(null);
        setUploadedFiles(newFiles);
        toast.success(`${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} uploaded`);
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
          hasFiles={uploadedFiles.length > 0}
          fileError={fileError}
        />
        
        {uploadedFiles.length > 0 && (
          <div className="mb-4 p-2 bg-muted rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">
                Uploaded Files ({uploadedFiles.length})
              </div>
              <button
                type="button"
                className="text-sm text-destructive hover:underline"
                onClick={() => {
                  setUploadedFiles([]);
                  setFileError(null);
                }}
              >
                Remove All
              </button>
            </div>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-1.5 bg-background rounded">
                  <span className="truncate max-w-[240px]">{file.name}</span>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => {
                      const newFiles = [...uploadedFiles];
                      newFiles.splice(index, 1);
                      setUploadedFiles(newFiles);
                      if (newFiles.length === 0) {
                        setFileError(null);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
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
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Select analysis type:</p>
            <QueryOptions
              onSelect={(option) => setSelectedOption(option as QueryType)}
              selectedOption={selectedOption}
            />
          </div>
          
          {selectedOption === 'legal-research' && (
            <div className="w-full max-w-3xl mx-auto">
              <Label htmlFor="research-database" className="text-sm font-medium mb-2 block">
                Research Database (Optional)
              </Label>
              <Select value={selectedResearchTool} onValueChange={(value) => setSelectedResearchTool(value as ResearchToolType | '')}>
                <SelectTrigger id="research-database" className="w-full">
                  <SelectValue placeholder="Select a research database (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Use built-in research)</SelectItem>
                  {researchTools.map((tool) => (
                    <SelectItem 
                      key={tool.id} 
                      value={tool.id}
                      disabled={!tool.isConfigured && tool.id !== 'googlescholar'}
                    >
                      {tool.name} {!tool.isConfigured && tool.id !== 'googlescholar' ? "(Not Configured)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedResearchTool && !isToolConfigured(selectedResearchTool) && selectedResearchTool !== 'googlescholar' && (
                <p className="text-xs text-amber-500 mt-1">
                  This database needs to be configured in the Research Tools tab
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default QueryForm;
