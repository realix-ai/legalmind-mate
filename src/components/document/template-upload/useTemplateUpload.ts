
import { useState } from 'react';
import { toast } from 'sonner';
import { saveCustomTemplate } from '@/utils/documents';
import handleFileUpload from './FileUploadHandler';

export const useTemplateUpload = (onTemplateAdded: () => void) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [importTab, setImportTab] = useState('upload');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, setContent);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please import content first');
      return;
    }
    
    try {
      // Generate default title from timestamp or file info
      const title = `Imported Document ${new Date().toLocaleString()}`;
      const description = 'Imported document';
      
      saveCustomTemplate(title, description, content, 'Custom');
      toast.success('Template uploaded successfully');
      onTemplateAdded();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };
  
  const resetForm = () => {
    setContent('');
    setGoogleDocUrl('');
    setImportTab('upload');
  };

  return {
    open,
    setOpen,
    content,
    setContent, 
    importTab,
    setImportTab,
    googleDocUrl,
    setGoogleDocUrl,
    isImporting,
    setIsImporting,
    handleSubmit,
    resetForm,
    fileUploadHandler
  };
};

export default useTemplateUpload;
