
import React from 'react';
import FileUploadButton from './FileUploadButton';
import SubmitButton from './SubmitButton';

interface QueryTextareaProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTriggerFileUpload: () => void;
  isProcessing: boolean;
  hasFile: boolean;
  fileError: string | null;
}

const QueryTextarea = ({ 
  query, 
  onChange, 
  onTriggerFileUpload, 
  isProcessing, 
  hasFile,
  fileError
}: QueryTextareaProps) => {
  return (
    <div className="relative mb-6">
      <textarea
        value={query}
        onChange={onChange}
        placeholder="Describe your legal question or issue..."
        className="w-full min-h-[80px] p-4 pr-12 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-y"
        disabled={isProcessing}
      />
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <SubmitButton 
          isProcessing={isProcessing} 
          isDisabled={!query.trim() || !!fileError} 
        />
      </div>
    </div>
  );
};

export default QueryTextarea;
