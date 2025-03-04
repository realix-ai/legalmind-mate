
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import QueryOptions from '@/components/QueryOptions';
import QueryTextarea from '@/components/QueryTextarea';
import FilePreview from '@/components/FilePreview';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  return (
    <motion.div variants={itemVariants}>
      <form onSubmit={handleSubmit} className="mb-8">
        <QueryTextarea
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onTriggerFileUpload={triggerFileUpload}
          isProcessing={isProcessing}
          hasFile={!!file}
          fileError={fileError}
        />
        
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
