
import { Button } from '@/components/ui/button';
import { Sparkles, Upload, PaperclipIcon, X } from 'lucide-react';
import { useFileUpload } from '@/hooks/ai/useFileUpload';
import { useState, useRef } from 'react';

interface AiPromptInputProps {
  aiPrompt: string;
  setPrompt: (prompt: string) => void;
  isProcessing: boolean;
  onSubmit: (prompt: string) => void;
}

const AiPromptInput = ({ 
  aiPrompt, 
  setPrompt, 
  isProcessing, 
  onSubmit 
}: AiPromptInputProps) => {
  const {
    uploadedFiles,
    setUploadedFiles,
    fileInputRef,
    handleFileUpload,
    handleFileChange,
    handleRemoveFile
  } = useFileUpload();

  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={uploadedFiles.length > 0 
            ? "Describe what you want AI to do with these files..." 
            : "Enter a prompt for AI assistance (e.g., 'Add a liability clause')"}
          className="flex-1 px-3 py-2 rounded-md border text-sm"
          disabled={isProcessing}
        />
        <Button 
          onClick={() => onSubmit(aiPrompt)}
          disabled={isProcessing || (!aiPrompt.trim() && uploadedFiles.length === 0)}
          size="sm"
          className="gap-1"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isProcessing ? "Processing..." : "Generate"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFileUpload}
          disabled={isProcessing}
          className="gap-1 text-xs"
          type="button"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Files</span>
        </Button>
        
        <input 
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
        />
        
        {uploadedFiles.length > 0 && (
          <div className="flex-1 text-xs">
            {uploadedFiles.length} file(s) uploaded
          </div>
        )}
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md space-y-1">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex justify-between text-xs bg-background rounded p-1.5">
              <span className="truncate max-w-[220px]">{file.name}</span>
              <button 
                onClick={() => handleRemoveFile(index)}
                className="text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiPromptInput;
