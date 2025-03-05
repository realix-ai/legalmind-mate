
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Upload } from 'lucide-react';
import { QueryType } from '@/services/legalQueryService';
import { BatchQuery } from './types';

interface BatchInputFormProps {
  onAddQuery: (query: BatchQuery) => void;
  isProcessing: boolean;
}

const BatchInputForm = ({ onAddQuery, isProcessing }: BatchInputFormProps) => {
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('legal-research');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const addQueryToBatch = () => {
    if (!queryText.trim()) {
      toast.error('Please enter a query');
      return;
    }
    
    const newQuery: BatchQuery = {
      id: `query-${Date.now()}`,
      text: queryText.trim(),
      type: queryType,
      status: 'pending',
      files: uploadedFiles
    };
    
    onAddQuery(newQuery);
    setQueryText('');
    setUploadedFiles([]);
    toast.success('Query added to batch');
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
          toast.error(`You can only upload up to ${MAX_FILES} files at once`);
          return;
        }
        
        // Check each file for size and type
        let hasError = false;
        for (const file of newFiles) {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
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
          
          if (!allowedTypes.includes(file.type) && 
              !(file.name.endsWith('.pdf') || 
                file.name.endsWith('.doc') || 
                file.name.endsWith('.docx') || 
                file.name.endsWith('.txt'))) {
            toast.error(`Unsupported file type: ${file.name}`);
            hasError = true;
            break;
          }
        }
        
        if (hasError) {
          return;
        }
        
        // Files are valid
        setUploadedFiles(newFiles);
        toast.success(`${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} uploaded`);
      }
    };
    
    input.click();
  };
  
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your legal query here..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        className="min-h-32 resize-none focus:border-primary focus:ring-primary"
        disabled={isProcessing}
      />
      
      {uploadedFiles.length > 0 && (
        <div className="p-2 bg-muted rounded-md">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">
              Uploaded Files ({uploadedFiles.length})
            </div>
            <button
              type="button"
              className="text-sm text-destructive hover:underline"
              onClick={() => setUploadedFiles([])}
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
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Select
            value={queryType}
            onValueChange={(value) => setQueryType(value as QueryType)}
            disabled={isProcessing}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select query type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="legal-research">Legal Research</SelectItem>
              <SelectItem value="risk-analysis">Risk Analysis</SelectItem>
              <SelectItem value="summarize">Summarize</SelectItem>
              <SelectItem value="data-analysis">Data Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            type="button"
            onClick={handleFileUpload} 
            variant="outline"
            disabled={isProcessing}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          
          <Button 
            onClick={addQueryToBatch} 
            className="w-full sm:w-auto"
            disabled={isProcessing || !queryText.trim()}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Batch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BatchInputForm;
