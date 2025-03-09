
import { SavedDocument } from './types';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to get auth context
const getAuthContext = () => {
  try {
    return useAuth();
  } catch (e) {
    // If this is called outside of the React component tree, return an empty prefix
    console.warn('Auth context not available, using default storage keys');
    return { getUserPrefix: () => '' };
  }
};

// Helper to get storage key with user prefix
const getStorageKey = (key: string): string => {
  try {
    const { getUserPrefix } = getAuthContext();
    return `${getUserPrefix()}${key}`;
  } catch (e) {
    // Fallback if called outside React context
    return key;
  }
};

// Document storage functions
export const saveDocument = (title: string, content: string, id?: string | null, caseId?: string, category?: string): SavedDocument => {
  const savedDocuments = getSavedDocuments();
  
  // Normalize the caseId if it exists
  const normalizedCaseId = caseId ? normalizeCaseId(caseId) : undefined;
  
  console.log("Saving document with normalized caseId:", normalizedCaseId);
  console.log("Original document title:", title);
  console.log("Document category:", category);
  
  // Ensure title is never empty
  const documentTitle = title.trim() ? title.trim() : "Untitled Document";
  
  // Check for existing external system references
  const externalSystem = id ? localStorage.getItem(getStorageKey(`doc-${id}-external-system`)) : undefined;
  const externalId = id ? localStorage.getItem(getStorageKey(`doc-${id}-external-id`)) : undefined;
  
  const newDocument: SavedDocument = {
    id: id || `doc-${Date.now()}`,
    title: documentTitle,
    content,
    lastModified: Date.now(),
    caseId: normalizedCaseId,
    category: category || 'general', // Use provided category or default to 'general'
    externalSystem: externalSystem || undefined,
    externalId: externalId || undefined
  };
  
  const existingIndex = id ? savedDocuments.findIndex(doc => doc.id === id) : -1;
  
  if (existingIndex >= 0) {
    console.log(`Updating existing document at index ${existingIndex}`);
    console.log("Previous document state:", savedDocuments[existingIndex]);
    
    // Preserve the existing caseId if not explicitly changing it
    if (caseId === undefined && savedDocuments[existingIndex].caseId) {
      newDocument.caseId = savedDocuments[existingIndex].caseId;
    }
    
    // Preserve existing category if not changing it
    if (category === undefined && savedDocuments[existingIndex].category) {
      newDocument.category = savedDocuments[existingIndex].category;
    }
    
    // Preserve external system references if they exist
    if (savedDocuments[existingIndex].externalSystem && !newDocument.externalSystem) {
      newDocument.externalSystem = savedDocuments[existingIndex].externalSystem;
    }
    
    if (savedDocuments[existingIndex].externalId && !newDocument.externalId) {
      newDocument.externalId = savedDocuments[existingIndex].externalId;
    }
    
    savedDocuments[existingIndex] = newDocument;
    console.log("Updated document:", newDocument);
  } else {
    console.log("Adding new document to storage");
    savedDocuments.push(newDocument);
  }
  
  localStorage.setItem(getStorageKey('savedDocuments'), JSON.stringify(savedDocuments));
  console.log("Saved documents to localStorage with title:", newDocument.title);
  return newDocument;
};

export const getSavedDocuments = (): SavedDocument[] => {
  const saved = localStorage.getItem(getStorageKey('savedDocuments'));
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
  localStorage.setItem(getStorageKey('savedDocuments'), JSON.stringify(filtered));
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
  
  localStorage.setItem(getStorageKey('savedDocuments'), JSON.stringify(documents));
  return documents[index];
};

// Update document category
export const updateDocumentCategory = (documentId: string, category: string): SavedDocument | null => {
  const documents = getSavedDocuments();
  const index = documents.findIndex(doc => doc.id === documentId);
  
  if (index === -1) return null;
  
  documents[index] = {
    ...documents[index],
    category
  };
  
  localStorage.setItem(getStorageKey('savedDocuments'), JSON.stringify(documents));
  return documents[index];
};

// Get documents by category
export const getDocumentsByCategory = (category: string): SavedDocument[] => {
  const documents = getSavedDocuments();
  return documents.filter(doc => doc.category === category);
};

// Get documents from external system 
export const getDocumentsByExternalSystem = (externalSystem: string): SavedDocument[] => {
  const documents = getSavedDocuments();
  return documents.filter(doc => doc.externalSystem === externalSystem);
};

// Update document with external system reference
export const updateDocumentExternalReference = (
  documentId: string, 
  externalSystem: string, 
  externalId: string
): SavedDocument | null => {
  const documents = getSavedDocuments();
  const index = documents.findIndex(doc => doc.id === documentId);
  
  if (index === -1) return null;
  
  documents[index] = {
    ...documents[index],
    externalSystem,
    externalId
  };
  
  // Also store in localStorage for backup
  const docSystemKey = getStorageKey(`doc-${documentId}-external-system`);
  const docIdKey = getStorageKey(`doc-${documentId}-external-id`);
  
  localStorage.setItem(docSystemKey, externalSystem);
  localStorage.setItem(docIdKey, externalId);
  
  localStorage.setItem(getStorageKey('savedDocuments'), JSON.stringify(documents));
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
