
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import FileUploadButton from './FileUploadButton';
import SubmitButton from './SubmitButton';

interface QueryTextareaProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTriggerFileUpload: () => void;
  isProcessing: boolean;
  hasFiles: boolean;
  fileError: string | null;
}

const QueryTextarea = ({ 
  query, 
  onChange, 
  onTriggerFileUpload, 
  isProcessing, 
  hasFiles,
  fileError
}: QueryTextareaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isProcessing) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Use the existing file upload handler
      onTriggerFileUpload();
      
      // Create a fake input change event for file upload logic
      const input = document.createElement('input');
      input.type = 'file';
      
      // Create a DataTransfer object
      const dataTransfer = new DataTransfer();
      
      // Add all files from the drop event
      Array.from(e.dataTransfer.files).forEach(file => {
        dataTransfer.items.add(file);
      });
      
      // Set the files to the input
      input.files = dataTransfer.files;
      
      // Dispatch a change event
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      toast.success(`${e.dataTransfer.files.length} ${e.dataTransfer.files.length === 1 ? 'file' : 'files'} uploaded`);
    }
  };

  return (
    <div 
      className="relative mb-6"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <textarea
        ref={textareaRef}
        value={query}
        onChange={onChange}
        placeholder="Describe your legal question or issue..."
        className={`w-full min-h-[80px] p-4 pr-12 rounded-xl border ${isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-input'} bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-y`}
        disabled={isProcessing}
      />
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-primary/70 font-medium">Drop files here</div>
        </div>
      )}
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <FileUploadButton 
          isProcessing={isProcessing}
          hasFiles={hasFiles}
          onClick={onTriggerFileUpload}
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
