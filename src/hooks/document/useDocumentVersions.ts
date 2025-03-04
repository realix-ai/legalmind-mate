
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type DocumentVersion = {
  id: string;
  name: string;
  documentId: string;
  content: string;
  timestamp: number;
  isCurrent: boolean;
  author?: {
    id: string;
    name: string;
  };
};

// Simulate a current user
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
};

export const useDocumentVersions = (documentId: string) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  
  const loadVersions = useCallback(() => {
    const stored = localStorage.getItem(`document_versions_${documentId}`);
    if (stored) {
      try {
        setVersions(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing versions:', e);
        setVersions([]);
      }
    }
  }, [documentId]);
  
  const saveVersions = useCallback((updatedVersions: DocumentVersion[]) => {
    localStorage.setItem(
      `document_versions_${documentId}`, 
      JSON.stringify(updatedVersions)
    );
    setVersions(updatedVersions);
  }, [documentId]);
  
  const saveVersion = useCallback((documentName: string, content: string, makeOtherVersionsNonCurrent = true) => {
    // Load current versions first to make sure we have the latest
    const stored = localStorage.getItem(`document_versions_${documentId}`);
    let currentVersions: DocumentVersion[] = [];
    
    if (stored) {
      try {
        currentVersions = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing versions:', e);
      }
    }
    
    // Update all other versions to be non-current if specified
    if (makeOtherVersionsNonCurrent) {
      currentVersions = currentVersions.map(version => ({
        ...version,
        isCurrent: false
      }));
    }
    
    // Add the new version
    const newVersion: DocumentVersion = {
      id: uuidv4(),
      name: documentName,
      documentId,
      content,
      timestamp: Date.now(),
      isCurrent: true,
      author: currentUser
    };
    
    const updatedVersions = [...currentVersions, newVersion];
    saveVersions(updatedVersions);
    
    // In a real application, you would send this to an API
    console.log('Saved new version:', newVersion.id);
    
    return newVersion;
  }, [documentId, saveVersions]);
  
  return {
    versions,
    saveVersion,
    loadVersions
  };
};
