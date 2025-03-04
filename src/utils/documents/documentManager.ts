
import { SavedDocument } from './types';

// Document storage functions
export const saveDocument = (title: string, content: string, id?: string | null, caseId?: string): SavedDocument => {
  const savedDocuments = getSavedDocuments();
  
  const newDocument: SavedDocument = {
    id: id || `doc-${Date.now()}`,
    title,
    content,
    lastModified: Date.now(),
    caseId
  };
  
  const existingIndex = id ? savedDocuments.findIndex(doc => doc.id === id) : -1;
  
  if (existingIndex >= 0) {
    // Preserve the existing caseId if not explicitly changing it
    if (!caseId && savedDocuments[existingIndex].caseId) {
      newDocument.caseId = savedDocuments[existingIndex].caseId;
    }
    savedDocuments[existingIndex] = newDocument;
  } else {
    savedDocuments.push(newDocument);
  }
  
  localStorage.setItem('savedDocuments', JSON.stringify(savedDocuments));
  return newDocument;
};

export const getSavedDocuments = (): SavedDocument[] => {
  const saved = localStorage.getItem('savedDocuments');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing saved documents', e);
    return [];
  }
};

export const getSavedDocument = (id: string): SavedDocument | null => {
  const documents = getSavedDocuments();
  return documents.find(doc => doc.id === id) || null;
};

export const deleteDocument = (id: string): void => {
  const documents = getSavedDocuments();
  const filtered = documents.filter(doc => doc.id !== id);
  localStorage.setItem('savedDocuments', JSON.stringify(filtered));
};

export const updateDocumentCaseId = (documentId: string, caseId?: string): SavedDocument | null => {
  const documents = getSavedDocuments();
  const index = documents.findIndex(doc => doc.id === documentId);
  
  if (index === -1) return null;
  
  documents[index] = {
    ...documents[index],
    caseId
  };
  
  localStorage.setItem('savedDocuments', JSON.stringify(documents));
  return documents[index];
};
