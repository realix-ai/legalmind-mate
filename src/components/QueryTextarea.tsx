
import React, { useState } from 'react';
import FileUploadButton from './FileUploadButton';
import SubmitButton from './SubmitButton';

interface QueryTextareaProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTriggerFileUpload: () => void;
  isProcessing: boolean;
  hasFile: boolean;
  fileError: string | null;
  onFileDrop?: (files: FileList) => void;
}

const QueryTextarea = ({ 
  query, 
  onChange, 
  onTriggerFileUpload, 
  isProcessing, 
  hasFile,
  fileError,
  onFileDrop
}: QueryTextareaProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onFileDrop) {
      onFileDrop(e.dataTransfer.files);
    }
  };

  return (
    <div 
      className={`relative mb-6 ${isDragging ? 'ring-2 ring-primary rounded-xl' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <textarea
        value={query}
        onChange={onChange}
        placeholder="Describe your legal question or issue..."
        className={`w-full min-h-[80px] p-4 pr-12 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-y ${isDragging ? 'border-primary' : ''}`}
        disabled={isProcessing}
      />
      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 rounded-xl flex items-center justify-center pointer-events-none">
          <p className="text-primary font-medium">Drop your file here</p>
        </div>
      )}
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <FileUploadButton 
          onClick={onTriggerFileUpload} 
          isProcessing={isProcessing} 
          hasFile={hasFile} 
        />
        <SubmitButton 
          isProcessing={isProcessing} 
          isDisabled={!query.trim() || !!fileError} 
        />
      </div>
    </div>
  );
};

export default QueryTextarea;
