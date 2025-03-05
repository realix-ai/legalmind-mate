
import { Case, SavedDocument } from './types';
import { getSavedDocuments, updateDocumentCaseId, normalizeCaseId } from './documentManager';

// Case management functions
export const createCase = (name: string): Case => {
  const cases = getCases();
  
  const newCase: Case = {
    id: `case-${Date.now()}`,
    name,
    createdAt: Date.now(),
    status: 'active',
    priority: 'medium'
  };
  
  cases.push(newCase);
  localStorage.setItem('cases', JSON.stringify(cases));
  console.log("Case created and saved to storage:", newCase);
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
  // Use normalized case ID for comparison
  const normalizedId = normalizeCaseId(id);
  return cases.find(c => c.id === normalizedId) || null;
};

export const deleteCase = (id: string): void => {
  const cases = getCases();
  // Use normalized case ID for comparison
  const normalizedId = normalizeCaseId(id);
  const filtered = cases.filter(c => c.id !== normalizedId);
  localStorage.setItem('cases', JSON.stringify(filtered));
  
  // Also remove case association from documents
  const documents = getSavedDocuments();
  documents.forEach(doc => {
    if (doc.caseId === normalizedId) {
      updateDocumentCaseId(doc.id, undefined);
    }
  });
};

export const getCaseDocuments = (caseId: string): SavedDocument[] => {
  const documents = getSavedDocuments();
  // Use normalized case ID for comparison
  const normalizedId = normalizeCaseId(caseId);
  return documents.filter(doc => doc.caseId === normalizedId);
};

export const getCaseDocumentsContent = (caseId: string): Array<{id: string, title: string, content: string}> => {
  const documents = getCaseDocuments(caseId);
  return documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    content: doc.content
  }));
};

export const updateCase = (id: string, name: string): Case | null => {
  return updateCaseDetails(id, { name });
};

export const updateCaseStatus = (id: string, status: 'active' | 'pending' | 'closed'): Case | null => {
  return updateCaseDetails(id, { status });
};

export const updateCasePriority = (id: string, priority: 'high' | 'medium' | 'low'): Case | null => {
  return updateCaseDetails(id, { priority });
};

export const updateCaseDeadline = (id: string, deadline: number | undefined): Case | null => {
  console.log(`Updating case ${id} deadline to timestamp:`, deadline);
  const result = updateCaseDetails(id, { deadline });
  console.log("Case after deadline update:", result);
  return result;
};

export const updateCaseNotes = (id: string, notes: string): Case | null => {
  return updateCaseDetails(id, { notes });
};

export const updateCaseDetails = (id: string, updates: Partial<Omit<Case, 'id' | 'createdAt'>>): Case | null => {
  const cases = getCases();
  // Use normalized case ID for comparison
  const normalizedId = normalizeCaseId(id);
  const index = cases.findIndex(c => c.id === normalizedId);
  
  if (index === -1) return null;
  
  console.log("Updating case in storage. Previous:", cases[index]);
  console.log("Updates to apply:", updates);
  
  cases[index] = {
    ...cases[index],
    ...updates
  };
  
  console.log("Updated case:", cases[index]);
  localStorage.setItem('cases', JSON.stringify(cases));
  return cases[index];
};
