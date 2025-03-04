import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, FileUp, AlertCircle, X, Image, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import QueryOptions from '@/components/QueryOptions';
import { QueryType } from '@/services/legalQueryService';
import { toast } from 'sonner';
import { isFileTypeSupported, getReadableFileSize, getFileTypeInfo } from '@/services/fileProcessingService';

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

  const renderFilePreview = () => {
    if (!file) return null;
    
    const fileInfo = getFileTypeInfo(file);
    
    return (
      <div className={`${fileError ? 'bg-destructive/10 border-destructive/50' : 'bg-primary/5'} border rounded-xl p-3 mb-4`}>
        <div className="flex justify-between items-start">
          <div className="flex space-x-3">
            {previewUrl && fileInfo.isImage ? (
              <div className="h-16 w-16 rounded-md overflow-hidden border bg-background flex-shrink-0">
                <img 
                  src={previewUrl} 
                  alt={file.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-md border bg-muted flex items-center justify-center flex-shrink-0">
                {fileInfo.isPdf ? (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Image className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            )}
            
            <div className="space-y-1 flex-grow overflow-hidden">
              <p className="font-medium text-sm truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{getReadableFileSize(file.size)}</p>
              {fileError && (
                <p className="text-xs text-destructive flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {fileError}
                </p>
              )}
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={clearFile}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
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
        
        {renderFilePreview()}
        
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
