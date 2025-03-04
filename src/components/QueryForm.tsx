
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, FileUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import QueryOptions from '@/components/QueryOptions';
import { QueryType } from '@/services/legalQueryService';
import { toast } from 'sonner';
import { isFileTypeSupported, getReadableFileSize } from '@/services/fileProcessingService';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      const errorMsg = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      setFileError(errorMsg);
      e.target.value = ''; // Clear the input
      toast.error(errorMsg);
      return;
    }
    
    // Check file type
    if (!isFileTypeSupported(selectedFile)) {
      const errorMsg = "Unsupported file type. Please upload a PDF, image, or text document.";
      setFileError(errorMsg);
      e.target.value = ''; // Clear the input
      toast.error(errorMsg);
      return;
    }
    
    console.log("File selected:", selectedFile.name, "Type:", selectedFile.type, "Size:", selectedFile.size);
    setFile(selectedFile);
    toast.success(`File "${selectedFile.name}" uploaded successfully`);
    
    // Optionally add file name to query text
    if (!query.includes(selectedFile.name)) {
      setQuery(prev => 
        prev ? `${prev}\n\nAttached file: ${selectedFile.name}` : `Attached file: ${selectedFile.name}`
      );
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    // Remove the file mention from the query if needed
    setQuery(prev => prev.replace(/\n\nAttached file:.*$/g, '').replace(/^Attached file:.*$/g, '').trim());
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log("File cleared");
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative mb-6">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your legal question or issue..."
            className="w-full min-h-[80px] p-4 pr-12 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-y"
            disabled={isProcessing}
          />
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button 
              type="button"
              size="icon"
              variant="ghost"
              disabled={isProcessing}
              className="hover:bg-primary/10 relative"
              onClick={triggerFileUpload}
            >
              <FileUp className={`h-5 w-5 ${file ? 'text-primary' : ''}`} />
              {file && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </Button>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!query.trim() || isProcessing || !!fileError}
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {file && (
          <div className={`text-sm border rounded-md p-2 mb-4 ${fileError ? 'bg-destructive/10 border-destructive/50' : 'bg-primary/5'} flex justify-between items-center`}>
            <div className="flex items-center space-x-2">
              {fileError ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <FileUp className="h-4 w-4 text-primary" />
              )}
              <span className="truncate max-w-[200px] md:max-w-md">
                {file.name} ({getReadableFileSize(file.size)})
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFile}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        )}
        
        {fileError && (
          <div className="text-sm text-destructive mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{fileError}</span>
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
