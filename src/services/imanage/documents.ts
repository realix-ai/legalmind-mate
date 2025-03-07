
import { toast } from 'sonner';
import { SavedDocument } from '@/utils/documents/types';
import { getIManageUrl, getAuthHeaders, isIManageConfigured } from './core';

// Fetch document from iManage
export const fetchDocumentFromIManage = async (documentId: string): Promise<SavedDocument | null> => {
  if (!isIManageConfigured()) {
    toast.error('iManage is not configured');
    return null;
  }

  try {
    const apiUrl = getIManageUrl();
    const response = await fetch(`${apiUrl}/documents/${documentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`iManage API error: ${response.status} ${response.statusText}`);
    }

    const iManageDoc = await response.json();
    
    // If content isn't included in the first request, fetch it separately
    let documentContent = iManageDoc.content || '';
    
    if (!documentContent && iManageDoc.contentUrl) {
      const contentResponse = await fetch(iManageDoc.contentUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('imanage-token')}`,
        },
      });
      
      if (contentResponse.ok) {
        // Try to get content as text first
        documentContent = await contentResponse.text();
      }
    }
    
    // Generate a unique local ID for this document
    const localId = `doc-${Date.now()}`;
    
    // Convert iManage document format to our application format
    const document: SavedDocument = {
      id: localId,
      title: iManageDoc.name || 'Untitled Document',
      content: documentContent,
      lastModified: Date.now(),
      category: iManageDoc.docClass || 'general',
      externalSystem: 'imanage',
      externalId: iManageDoc.id,
    };
    
    // Save the document locally with reference to iManage
    localStorage.setItem(`doc-${localId}-external-system`, 'imanage');
    localStorage.setItem(`doc-${localId}-external-id`, iManageDoc.id);
    
    return document;
  } catch (error) {
    console.error('Error fetching document from iManage:', error);
    toast.error('Failed to fetch document from iManage');
    return null;
  }
};

// Save document to iManage
export const saveDocumentToIManage = async (
  title: string,
  content: string,
  category: string = 'general',
  externalId?: string
): Promise<{success: boolean, documentId?: string}> => {
  if (!isIManageConfigured()) {
    toast.error('iManage is not configured');
    return { success: false };
  }

  try {
    const apiUrl = getIManageUrl();
    const endpoint = externalId 
      ? `${apiUrl}/documents/${externalId}` 
      : `${apiUrl}/documents`;
    
    const method = externalId ? 'PUT' : 'POST';
    
    const documentData = {
      name: title,
      content: content,
      docClass: category,
      // Add other iManage-specific metadata as needed
      clientMatter: localStorage.getItem('current-matter') || '',
      author: localStorage.getItem('user-name') || 'Unknown',
    };
    
    const response = await fetch(endpoint, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(documentData),
    });
    
    if (!response.ok) {
      throw new Error(`iManage API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    toast.success(`Document saved to iManage successfully`);
    return { success: true, documentId: result.id };
  } catch (error) {
    console.error('Error saving document to iManage:', error);
    toast.error('Failed to save document to iManage');
    return { success: false };
  }
};
