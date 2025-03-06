
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { saveCustomTemplate } from '@/utils/documents';
import handleFileUpload from './FileUploadHandler';

export const useTemplateUpload = (onTemplateAdded: () => void) => {
  // Using plain useState hooks without dependencies to avoid React queue issues
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [importTab, setImportTab] = useState<string>('upload');
  const [googleDocUrl, setGoogleDocUrl] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  
  const fileUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error('No file selected');
      return false;
    }
    
    try {
      const success = await handleFileUpload(e, setContent);
      console.log('File upload handler result:', success);
      return success;
    } catch (error) {
      console.error('Error in fileUploadHandler:', error);
      toast.error('File upload failed');
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form, content length:', content.length);
    
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
      console.log('Template created:', template);
      
      // Call onTemplateAdded before attempting to navigate
      onTemplateAdded();
      
      toast.success('Template uploaded successfully');
      
      // Create absolute URL and use window.location.replace for cleaner navigation
      const baseUrl = window.location.origin;
      const targetUrl = `${baseUrl}/document-drafting/${template.id}`;
      
      console.log('Created template with ID:', template.id);
      console.log('Redirecting to:', targetUrl);
      
      // Use replace instead of setting href directly to avoid adding to history
      window.location.replace(targetUrl);
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
