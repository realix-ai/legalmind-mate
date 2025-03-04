
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';
import QueryOptions from '@/components/QueryOptions';
import { QueryType } from '@/services/legalQueryService';
import { toast } from 'sonner';

interface QueryFormProps {
  onSubmit: (query: string, queryType: QueryType) => Promise<void>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await onSubmit(query.trim(), selectedOption);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 10MB');
        return;
      }
      
      setFile(selectedFile);
      toast.success(`File "${selectedFile.name}" uploaded successfully`);
      
      // Optionally add file name to query text
      if (!query.includes(selectedFile.name)) {
        setQuery(prev => 
          prev ? `${prev}\n\nAttached file: ${selectedFile.name}` : `Attached file: ${selectedFile.name}`
        );
      }
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
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button 
                type="button"
                size="icon"
                variant="ghost"
                disabled={isProcessing}
                className="hover:bg-primary/10"
              >
                <FileUp className="h-5 w-5" />
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </label>
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
            <span className="truncate">{file.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setFile(null);
                // Remove the file mention from the query if needed
                setQuery(prev => prev.replace(`\n\nAttached file: ${file.name}`, '').replace(`Attached file: ${file.name}`, '').trim());
              }}
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
