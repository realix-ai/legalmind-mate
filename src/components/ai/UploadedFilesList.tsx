
import React from 'react';

interface UploadedFilesListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-muted/50 p-2 rounded-md space-y-1">
      <p className="text-sm font-medium mb-1">Uploaded Files:</p>
      {files.map((file, index) => (
        <div key={index} className="flex justify-between text-xs bg-background rounded p-1.5">
          <span className="truncate max-w-[220px]">{file.name}</span>
          <button 
            onClick={() => onRemoveFile(index)}
            className="text-destructive hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default UploadedFilesList;
