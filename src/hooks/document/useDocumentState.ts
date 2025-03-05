
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getSavedDocument, saveDocument } from '@/utils/documents';

export function useDocumentState(documentId: string | undefined) {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(!documentId);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(documentId || null);

  useEffect(() => {
    if (documentId) {
      // Load existing document
      const document = getSavedDocument(documentId);
      if (document) {
        setDocumentTitle(document.title);
        setDocumentContent(document.content);
        setCurrentDocumentId(documentId);
        setShowTemplates(false);
      } else {
        toast.error('Document not found');
        navigate('/document-drafting');
      }
    }
  }, [documentId, navigate]);

  const handleSaveDocument = () => {
    if (!documentTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    
    const savedDoc = saveDocument(documentTitle, documentContent, currentDocumentId);
    setCurrentDocumentId(savedDoc.id);
    toast.success('Document saved successfully');
  };

  const handleDocumentSaved = (id: string) => {
    setCurrentDocumentId(id);
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
      setShowTemplates(false);
      return;
    }
    
    // Get template or document by ID and set title/content
    const document = getSavedDocument(id);
    if (document) {
      setDocumentTitle(document.title);
      setDocumentContent(document.content);
      setShowTemplates(false);
    }
  };

  return {
    showTemplates,
    setShowTemplates,
    documentTitle,
    setDocumentTitle,
    documentContent,
    setDocumentContent,
    currentDocumentId,
    setCurrentDocumentId,
    handleSaveDocument,
    handleDocumentSaved,
    handleBack,
    handleSelectTemplate,
  };
}
