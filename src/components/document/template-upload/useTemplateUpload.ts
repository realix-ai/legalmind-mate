
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { saveCustomTemplate } from '@/utils/documents';
import handleFileUpload from './FileUploadHandler';

export const useTemplateUpload = (onTemplateAdded: () => void) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [importTab, setImportTab] = useState('upload');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const fileUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const success = await handleFileUpload(e, setContent);
    return success;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please import content first');
      return;
    }
    
    try {
      // Generate title from file info or timestamp
      const timestamp = new Date().toLocaleString();
      const title = `Imported Document ${timestamp}`;
      const description = 'Imported document';
      
      const template = saveCustomTemplate(title, description, content, 'Custom');
      toast.success('Template uploaded successfully');
      onTemplateAdded();
      setOpen(false);
      
      // Navigate to document editor with the new template
      // Use a short timeout to allow the dialog to close and UI to update
      console.log('Created template with ID:', template.id);
      
      // Wait briefly to ensure dialog is fully closed before navigation
      setTimeout(() => {
        console.log('Navigating to:', `/document-drafting/${template.id}`);
        navigate(`/document-drafting/${template.id}`);
      }, 300);
      
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };
  
  const resetForm = useCallback(() => {
    setContent('');
    setGoogleDocUrl('');
    setImportTab('upload');
    setIsImporting(false);
  }, []);

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
