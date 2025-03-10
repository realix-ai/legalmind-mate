import { toast } from 'sonner';
import { getIManageUrl, getAuthHeaders, isIManageConfigured, handleApiError } from './core';
import { SavedDocument } from '@/utils/documents/types';

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

// Get a document from iManage by its ID
export const getDocumentFromIManage = async (documentId: string): Promise<{
  success: boolean;
  document?: SavedDocument;
  message?: string;
}> => {
  if (!isIManageConfigured()) {
    return { success: false, message: "iManage not configured" };
  }
  
  try {
    const apiUrl = `${getIManageUrl()}/documents/${documentId}`;
    
    // This would be a real API call in production
    // For demo purposes, we'll simulate a successful response
    console.log(`Fetching document ${documentId} from iManage API: ${apiUrl}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate a successful response
    const mockDocument: SavedDocument = {
      id: `local-${Date.now()}`,
      title: `iManage Document ${documentId}`,
      content: `This is the content of document ${documentId} retrieved from iManage.`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      category: 'contract',
      externalId: documentId,
      externalSystem: 'imanage'
    };
    
    return {
      success: true,
      document: mockDocument
    };
  } catch (error) {
    return handleApiError(error, "Failed to retrieve document from iManage");
  }
};

// Lock a document in iManage for editing
export const lockDocumentInIManage = async (documentId: string): Promise<{
  success: boolean;
  message?: string;
}> => {
  if (!isIManageConfigured()) {
    return { success: false, message: "iManage not configured" };
  }
  
  try {
    const apiUrl = `${getIManageUrl()}/documents/${documentId}/lock`;
    
    console.log(`Locking document ${documentId} in iManage API: ${apiUrl}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would be an actual API call:
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: getAuthHeaders()
    // });
    //
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return { success: false, message: errorData.message || "Failed to lock document" };
    // }
    
    // For demo purposes, return success
    return {
      success: true
    };
  } catch (error) {
    return handleApiError(error, "Failed to lock document in iManage");
  }
};

// Unlock a document in iManage
export const unlockDocumentInIManage = async (documentId: string): Promise<{
  success: boolean;
  message?: string;
}> => {
  if (!isIManageConfigured()) {
    return { success: false, message: "iManage not configured" };
  }
  
  try {
    const apiUrl = `${getIManageUrl()}/documents/${documentId}/unlock`;
    
    console.log(`Unlocking document ${documentId} in iManage API: ${apiUrl}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would be an actual API call:
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: getAuthHeaders()
    // });
    //
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return { success: false, message: errorData.message || "Failed to unlock document" };
    // }
    
    // For demo purposes, return success
    return {
      success: true
    };
  } catch (error) {
    return handleApiError(error, "Failed to unlock document in iManage");
  }
};

// Save document to iManage (update to support updating existing documents)
export const saveDocumentToIManage = async (
  title: string,
  content: string,
  category: string = 'general',
  existingDocumentId?: string
): Promise<{
  success: boolean;
  documentId?: string;
  message?: string;
}> => {
  if (!isIManageConfigured()) {
    return { success: false, message: "iManage not configured" };
  }
  
  try {
    // Determine if this is an update or a new document
    const isUpdate = !!existingDocumentId;
    const apiUrl = isUpdate 
      ? `${getIManageUrl()}/documents/${existingDocumentId}` 
      : `${getIManageUrl()}/documents`;
    
    const method = isUpdate ? 'PUT' : 'POST';
    
    console.log(`${isUpdate ? 'Updating' : 'Saving'} document to iManage API: ${apiUrl}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would be an actual API call:
    // const response = await fetch(apiUrl, {
    //   method,
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({
    //     title,
    //     content,
    //     category
    //   })
    // });
    //
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return { success: false, message: errorData.message || "Failed to save document" };
    // }
    //
    // const data = await response.json();
    
    // For demo purposes, return success with an ID
    const documentId = existingDocumentId || `imanage-doc-${Date.now()}`;
    
    return {
      success: true,
      documentId
    };
  } catch (error) {
    return handleApiError(error, "Failed to save document to iManage");
  }
};
