
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QueryOptions from '@/components/QueryOptions';
import QueryTextarea from '@/components/QueryTextarea';
import FilePreview from '@/components/FilePreview';
import PromptManager from '@/components/PromptManager';
import { QueryType } from '@/services/legalQueryService';
import { isFileTypeSupported, getFileTypeInfo } from '@/services/fileProcessingService';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPromptManager, setShowPromptManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptManagerRef.current && 
        !promptManagerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-prompt-button="true"]')
      ) {
        setShowPromptManager(false);
      }
    };

    if (showPromptManager) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPromptManager]);

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

  const generatePreview = (selectedFile: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const fileInfo = getFileTypeInfo(selectedFile);
    
    if (fileInfo.isImage) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      console.log("Preview URL generated:", url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    
    if (!selectedFile) {
      console.log("No file selected");
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      const errorMsg = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      setFileError(errorMsg);
      e.target.value = ''; // Clear the input
      toast.error(errorMsg);
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    
    if (!isFileTypeSupported(selectedFile)) {
      const errorMsg = "Unsupported file type. Please upload a PDF, image, or text document.";
      setFileError(errorMsg);
      e.target.value = ''; // Clear the input
      toast.error(errorMsg);
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    
    console.log("File selected:", selectedFile.name, "Type:", selectedFile.type, "Size:", selectedFile.size);
    setFile(selectedFile);
    generatePreview(selectedFile);
    toast.success(`File "${selectedFile.name}" uploaded successfully`);
    
    if (!query.includes(selectedFile.name)) {
      setQuery(prev => 
        prev ? `${prev}\n\nAttached file: ${selectedFile.name}` : `Attached file: ${selectedFile.name}`
      );
    }
  };

  const handleFileDrop = (files: FileList) => {
    if (files.length > 0) {
      const droppedFile = files[0]; // Only process the first file if multiple are dropped
      
      setFileError(null);
      
      if (droppedFile.size > MAX_FILE_SIZE) {
        const errorMsg = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        setFileError(errorMsg);
        toast.error(errorMsg);
        setPreviewUrl(null);
        setFile(null);
        return;
      }
      
      if (!isFileTypeSupported(droppedFile)) {
        const errorMsg = "Unsupported file type. Please upload a PDF, image, or text document.";
        setFileError(errorMsg);
        toast.error(errorMsg);
        setPreviewUrl(null);
        setFile(null);
        return;
      }
      
      console.log("File dropped:", droppedFile.name, "Type:", droppedFile.type, "Size:", droppedFile.size);
      setFile(droppedFile);
      generatePreview(droppedFile);
      toast.success(`File "${droppedFile.name}" uploaded successfully`);
      
      if (!query.includes(droppedFile.name)) {
        setQuery(prev => 
          prev ? `${prev}\n\nAttached file: ${droppedFile.name}` : `Attached file: ${droppedFile.name}`
        );
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    setQuery(prev => prev.replace(/\n\nAttached file:.*$/g, '').replace(/^Attached file:.*$/g, '').trim());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    console.log("File cleared");
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLoadPrompt = (promptText: string) => {
    setQuery(promptText);
    setShowPromptManager(false); // Hide prompt manager after selection
  };

  const togglePromptManager = () => {
    setShowPromptManager(!showPromptManager);
  };

  return (
    <motion.div variants={itemVariants}>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative mb-2">
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 absolute right-0 top-0 z-10"
            onClick={togglePromptManager}
            data-prompt-button="true"
          >
            <List className="h-3.5 w-3.5" />
            Load Prompts
          </Button>
        </div>
        
        <QueryTextarea
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onTriggerFileUpload={triggerFileUpload}
          isProcessing={isProcessing}
          hasFile={!!file}
          fileError={fileError}
          onFileDrop={handleFileDrop}
        />
        
        {showPromptManager && (
          <div 
            ref={promptManagerRef}
            className="relative z-10 w-72 shadow-md mb-4"
          >
            <PromptManager onSelectPrompt={handleLoadPrompt} />
          </div>
        )}
        
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        
        {file && (
          <FilePreview 
            file={file}
            previewUrl={previewUrl}
            fileError={fileError}
            onClearFile={clearFile}
          />
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
