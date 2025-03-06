
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import UploadedFilesList from './UploadedFilesList';

interface AiPromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  placeholder: string;
  uploadedFiles: File[];
  handleFileUpload: () => void;
  handleRemoveFile: (index: number) => void;
  handleSubmit: () => void;
  isProcessing: boolean;
  showUploadButton: boolean;
}

const AiPromptForm: React.FC<AiPromptFormProps> = ({
  prompt,
  setPrompt,
  placeholder,
  uploadedFiles,
  handleFileUpload,
  handleRemoveFile,
  handleSubmit,
  isProcessing,
  showUploadButton
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={uploadedFiles.length > 0 
            ? "Describe what you want AI to do with these files..." 
            : placeholder}
          className="min-h-[100px] mb-2"
        />
        
        {showUploadButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileUpload}
            disabled={isProcessing}
            className="gap-1 self-start mb-2"
            type="button"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </Button>
        )}
      </div>
      
      <UploadedFilesList 
        files={uploadedFiles}
        onRemoveFile={handleRemoveFile}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing || (!prompt.trim() && uploadedFiles.length === 0)}
          size="sm"
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AiPromptForm;
