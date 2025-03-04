
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';
import QueryOptions from '@/components/QueryOptions';
import { QueryType } from '@/services/legalQueryService';
import { toast } from 'sonner';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a query");
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
    
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    
    // Check file size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB');
      e.target.value = ''; // Clear the input
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
              className="hover:bg-primary/10"
              onClick={triggerFileUpload}
            >
              <FileUp className="h-5 w-5" />
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
              disabled={!query.trim() || isProcessing}
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
          <div className="text-sm border rounded-md p-2 mb-4 bg-primary/5 flex justify-between items-center">
            <span className="truncate">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
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
