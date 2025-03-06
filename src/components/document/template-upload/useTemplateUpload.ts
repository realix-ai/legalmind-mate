
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
      toast.success('Template uploaded successfully');
      onTemplateAdded();
      
      // Reset form and close dialog BEFORE navigation
      resetForm();
      setOpen(false);
      
      // Log navigation information
      console.log('Created template with ID:', template.id);
      console.log('About to navigate to:', `/document-drafting/${template.id}`);
      
      // Use direct navigation without setTimeout
      navigate(`/document-drafting/${template.id}`);
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
