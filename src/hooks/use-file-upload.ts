
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { isFileTypeSupported, getFileTypeInfo } from '@/services/fileProcessingService';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const useFileUpload = (onUpdateQuery: (fn: (prev: string) => string) => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const generatePreview = (selectedFile: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const fileInfo = getFileTypeInfo(selectedFile);
    
    if (fileInfo.isImage) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      console.log("Preview URL generated:", url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    
    if (!selectedFile) {
      console.log("No file selected");
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      const errorMsg = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      setFileError(errorMsg);
      e.target.value = ''; // Clear the input
      toast.error(errorMsg);
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    
    if (!isFileTypeSupported(selectedFile)) {
      const errorMsg = "Unsupported file type. Please upload a PDF, image, or text document.";
      setFileError(errorMsg);
      e.target.value = ''; // Clear the input
      toast.error(errorMsg);
      setPreviewUrl(null);
      setFile(null);
      return;
    }
    
    console.log("File selected:", selectedFile.name, "Type:", selectedFile.type, "Size:", selectedFile.size);
    setFile(selectedFile);
    generatePreview(selectedFile);
    toast.success(`File "${selectedFile.name}" uploaded successfully`);
    
    onUpdateQuery(prev => 
      prev ? `${prev}\n\nAttached file: ${selectedFile.name}` : `Attached file: ${selectedFile.name}`
    );
  };

  const handleFileDrop = (files: FileList) => {
    if (files.length > 0) {
      const droppedFile = files[0]; // Only process the first file if multiple are dropped
      
      setFileError(null);
      
      if (droppedFile.size > MAX_FILE_SIZE) {
        const errorMsg = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        setFileError(errorMsg);
        toast.error(errorMsg);
        setPreviewUrl(null);
        setFile(null);
        return;
      }
      
      if (!isFileTypeSupported(droppedFile)) {
        const errorMsg = "Unsupported file type. Please upload a PDF, image, or text document.";
        setFileError(errorMsg);
        toast.error(errorMsg);
        setPreviewUrl(null);
        setFile(null);
        return;
      }
      
      console.log("File dropped:", droppedFile.name, "Type:", droppedFile.type, "Size:", droppedFile.size);
      setFile(droppedFile);
      generatePreview(droppedFile);
      toast.success(`File "${droppedFile.name}" uploaded successfully`);
      
      onUpdateQuery(prev => 
        prev ? `${prev}\n\nAttached file: ${droppedFile.name}` : `Attached file: ${droppedFile.name}`
      );
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    onUpdateQuery(prev => prev.replace(/\n\nAttached file:.*$/g, '').replace(/^Attached file:.*$/g, '').trim());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    console.log("File cleared");
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    file,
    fileError,
    previewUrl,
    fileInputRef,
    handleFileChange,
    handleFileDrop,
    clearFile,
    triggerFileUpload
  };
};
