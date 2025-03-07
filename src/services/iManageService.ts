
import { toast } from 'sonner';
import { SavedDocument } from '@/utils/documents/types';

// Update this with your iManage API URL
const IMANAGE_API_URL = 'https://your-imanage-instance.com/api/v2';

// Set this to true once you've configured your iManage integration
const isIManageConfigured = (): boolean => {
  const token = localStorage.getItem('imanage-token');
  const url = localStorage.getItem('imanage-url');
  return !!token && !!url;
};

// Get the saved iManage API URL
export const getIManageUrl = (): string => {
  return localStorage.getItem('imanage-url') || IMANAGE_API_URL;
};

// Set iManage credentials
export const setIManageCredentials = (url: string, token: string): void => {
  localStorage.setItem('imanage-url', url);
  localStorage.setItem('imanage-token', token);
  toast.success('iManage credentials saved');
};

// Clear iManage credentials
export const clearIManageCredentials = (): void => {
  localStorage.removeItem('imanage-url');
  localStorage.removeItem('imanage-token');
  toast.success('iManage credentials cleared');
};

// Helper to handle API response errors
const handleApiError = (error: any, fallbackMessage: string): never => {
  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  console.error(errorMessage, error);
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('imanage-token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`iManage API error: ${response.status} ${response.statusText}`);
    }

    const iManageDoc = await response.json();
    
    // Convert iManage document format to our application format
    const document: SavedDocument = {
      id: iManageDoc.id || `doc-${Date.now()}`,
      title: iManageDoc.name || 'Untitled Document',
      content: iManageDoc.content || '',
      lastModified: Date.now(),
      category: iManageDoc.docClass || 'general',
      externalSystem: 'imanage',
      externalId: iManageDoc.id,
    };
    
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('imanage-token')}`,
        'Content-Type': 'application/json',
      },
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

// Search documents in iManage
export const searchIManageDocuments = async (query: string): Promise<SavedDocument[]> => {
  if (!isIManageConfigured()) {
    toast.error('iManage is not configured');
    return [];
  }

  try {
    const apiUrl = getIManageUrl();
    const response = await fetch(`${apiUrl}/documents/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('imanage-token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`iManage API error: ${response.status} ${response.statusText}`);
    }
    
    const results = await response.json();
    
    // Convert iManage document format to our application format
    return results.documents.map((doc: any) => ({
      id: `imanage-${doc.id}`,
      title: doc.name || 'Untitled Document',
      content: '', // Content is not included in search results
      lastModified: doc.modifiedDate ? new Date(doc.modifiedDate).getTime() : Date.now(),
      category: doc.docClass || 'general',
      externalSystem: 'imanage',
      externalId: doc.id,
    }));
  } catch (error) {
    console.error('Error searching iManage documents:', error);
    toast.error('Failed to search iManage documents');
    return [];
  }
};

// Check iManage connection
export const checkIManageConnection = async (): Promise<boolean> => {
  if (!isIManageConfigured()) {
    return false;
  }

  try {
    const apiUrl = getIManageUrl();
    const response = await fetch(`${apiUrl}/system/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('imanage-token')}`,
      },
      // Add a timeout to prevent long waits
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking iManage connection:', error);
    return false;
  }
};

// Get iManage connection status
export const getIManageStatus = (): 'connected' | 'disconnected' | 'checking' => {
  if (!isIManageConfigured()) {
    return 'disconnected';
  }
  
  // We can't know for sure without checking the API, but we can assume it's connected
  // if the credentials are configured
  return 'connected';
};
