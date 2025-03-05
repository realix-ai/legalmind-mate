
import { useState } from 'react';
import { toast } from 'sonner';

export const useFileHandler = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

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
          setFileError(`You can only upload up to ${MAX_FILES} files at once`);
          toast.error(`You can only upload up to ${MAX_FILES} files at once`);
          return;
        }
        
        // Check each file for size and type
        let hasError = false;
        for (const file of newFiles) {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            setFileError(`File ${file.name} exceeds the limit of 10MB`);
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
          
          if (!allowedTypes.includes(file.type)) {
            setFileError(`File ${file.name} has an unsupported type. Please upload PDF, Word, or Text files`);
            toast.error(`Unsupported file type: ${file.name}`);
            hasError = true;
            break;
          }
        }
        
        if (hasError) {
          setUploadedFiles([]);
          return;
        }
        
        // Files are valid
        setFileError(null);
        setUploadedFiles(newFiles);
        toast.success(`${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} uploaded`);
      }
    };
    
    input.click();
  };

  return {
    uploadedFiles,
    setUploadedFiles,
    fileError,
    setFileError,
    handleFileUpload
  };
};
