
import { Case, SavedDocument } from './types';
import { getSavedDocuments, updateDocumentCaseId } from './documentManager';

// Case management functions
export const createCase = (name: string): Case => {
  const cases = getCases();
  
  const newCase: Case = {
    id: `case-${Date.now()}`,
    name,
    createdAt: Date.now()
  };
  
  cases.push(newCase);
  localStorage.setItem('cases', JSON.stringify(cases));
  return newCase;
};

export const getCases = (): Case[] => {
  const saved = localStorage.getItem('cases');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing cases', e);
    return [];
  }
};

export const getCase = (id: string): Case | null => {
  const cases = getCases();
  return cases.find(c => c.id === id) || null;
};

export const deleteCase = (id: string): void => {
  const cases = getCases();
  const filtered = cases.filter(c => c.id !== id);
  localStorage.setItem('cases', JSON.stringify(filtered));
  
  // Also remove case association from documents
  const documents = getSavedDocuments();
  documents.forEach(doc => {
    if (doc.caseId === id) {
      updateDocumentCaseId(doc.id, undefined);
    }
  });
};

export const getCaseDocuments = (caseId: string): SavedDocument[] => {
  const documents = getSavedDocuments();
  return documents.filter(doc => doc.caseId === caseId);
};
