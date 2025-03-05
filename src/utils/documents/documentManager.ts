
import { SavedDocument } from './types';

// Document storage functions
export const saveDocument = (title: string, content: string, id?: string | null, caseId?: string): SavedDocument => {
  const savedDocuments = getSavedDocuments();
  
  // Normalize the caseId if it exists
  const normalizedCaseId = caseId ? normalizeCaseId(caseId) : undefined;
  
  console.log("Saving document with normalized caseId:", normalizedCaseId);
  
  const newDocument: SavedDocument = {
    id: id || `doc-${Date.now()}`,
    title,
    content,
    lastModified: Date.now(),
    caseId: normalizedCaseId
  };
  
  const existingIndex = id ? savedDocuments.findIndex(doc => doc.id === id) : -1;
  
  if (existingIndex >= 0) {
    console.log(`Updating existing document at index ${existingIndex}`);
    console.log("Previous document state:", savedDocuments[existingIndex]);
    
    // Preserve the existing caseId if not explicitly changing it
    if (caseId === undefined && savedDocuments[existingIndex].caseId) {
      newDocument.caseId = savedDocuments[existingIndex].caseId;
    }
    
    savedDocuments[existingIndex] = newDocument;
    console.log("Updated document:", newDocument);
  } else {
    console.log("Adding new document to storage");
    savedDocuments.push(newDocument);
  }
  
  localStorage.setItem('savedDocuments', JSON.stringify(savedDocuments));
  console.log("Saved documents to localStorage");
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
  
  // Normalize the caseId if it exists
  const normalizedCaseId = caseId ? normalizeCaseId(caseId) : undefined;
  
  documents[index] = {
    ...documents[index],
    caseId: normalizedCaseId
  };
  
  localStorage.setItem('savedDocuments', JSON.stringify(documents));
  return documents[index];
};

// Helper function to normalize case IDs
export const normalizeCaseId = (caseId: string): string => {
  if (!caseId) return '';
  
  // If it already starts with 'case-', return it
  if (caseId.startsWith('case-')) {
    return caseId;
  }
  
  // Otherwise, ensure it has the 'case-' prefix
  return `case-${caseId.replace(/^case-/, '')}`;
};
