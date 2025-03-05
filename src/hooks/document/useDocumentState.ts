
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getSavedDocument, saveDocument } from '@/utils/documents';
import { getTemplateContent } from '@/utils/documents/templateData';
import { getCustomTemplate } from '@/utils/documents/templateManager';

export function useDocumentState(documentId: string | undefined) {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(!documentId);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [documentCategory, setDocumentCategory] = useState('general');
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(documentId || null);

  useEffect(() => {
    if (documentId) {
      // Load existing document
      const document = getSavedDocument(documentId);
      if (document) {
        setDocumentTitle(document.title);
        setDocumentContent(document.content);
        setDocumentCategory(document.category || 'general');
        setCurrentDocumentId(documentId);
        setShowTemplates(false);
      } else {
        toast.error('Document not found');
        navigate('/document-drafting');
      }
    }
  }, [documentId, navigate]);

  const handleSaveDocument = () => {
    // Ensure we have a valid title
    const titleToSave = documentTitle.trim() || "Untitled Document";
    
    console.log("Saving document with title:", titleToSave);
    console.log("Current ID:", currentDocumentId);
    console.log("Category:", documentCategory);
    
    // Pass the category when saving the document
    const savedDoc = saveDocument(titleToSave, documentContent, currentDocumentId, undefined, documentCategory);
    setCurrentDocumentId(savedDoc.id);
    
    // Make sure our local state matches what was saved
    setDocumentTitle(savedDoc.title);
    
    console.log("Document saved with ID:", savedDoc.id, "and title:", savedDoc.title);
    toast.success('Document saved successfully');
  };

  const handleDocumentSaved = (id: string) => {
    console.log("Document saved with ID:", id);
    
    // Update the local state with the latest document data
    const savedDoc = getSavedDocument(id);
    if (savedDoc) {
      setCurrentDocumentId(id);
      setDocumentTitle(savedDoc.title);
      setDocumentCategory(savedDoc.category || 'general');
      console.log("Updated document title to:", savedDoc.title);
    }
  };

  const handleBack = () => {
    if (documentId) {
      navigate('/cases');
    } else {
      setShowTemplates(true);
    }
  };

  const handleSelectTemplate = (id: string) => {
    if (id === 'blank') {
      // Create a new blank document
      setDocumentTitle('Untitled Document');
      setDocumentContent('');
      setDocumentCategory('general');
      setShowTemplates(false);
      return;
    }
    
    // First check if it's a saved document
    const document = getSavedDocument(id);
    if (document) {
      setDocumentTitle(document.title);
      setDocumentContent(document.content);
      setDocumentCategory(document.category || 'general');
      setShowTemplates(false);
      return;
    }
    
    // Then check if it's a custom template
    const customTemplate = getCustomTemplate(id);
    if (customTemplate) {
      setDocumentTitle(customTemplate.title);
      setDocumentContent(customTemplate.content);
      setDocumentCategory(customTemplate.category);
      setShowTemplates(false);
      return;
    }
    
    // Finally check if it's a predefined template
    const templateContent = getTemplateContent(id);
    if (templateContent) {
      // Extract title from id (e.g., "contract-nda" -> "Non-Disclosure Agreement")
      const idParts = id.split('-');
      const defaultTitle = idParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
      
      setDocumentTitle(defaultTitle);
      setDocumentContent(templateContent);
      setDocumentCategory(idParts[0] || 'general'); // Use first part of ID as category
      setShowTemplates(false);
      toast.success(`Template loaded: ${defaultTitle}`);
    } else {
      toast.error('Template not found');
    }
  };

  const handleCategoryChange = (category: string) => {
    setDocumentCategory(category);
    
    // If we have a current document, update its category in storage
    if (currentDocumentId) {
      saveDocument(documentTitle, documentContent, currentDocumentId, undefined, category);
      console.log("Updated document category to:", category);
    }
  };

  return {
    showTemplates,
    setShowTemplates,
    documentTitle,
    setDocumentTitle,
    documentContent,
    setDocumentContent,
    documentCategory,
    setDocumentCategory,
    currentDocumentId,
    setCurrentDocumentId,
    handleSaveDocument,
    handleDocumentSaved,
    handleBack,
    handleSelectTemplate,
    handleCategoryChange,
  };
}
