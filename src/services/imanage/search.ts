
import { toast } from 'sonner';
import { SavedDocument } from '@/utils/documents/types';
import { getIManageUrl, getAuthHeaders, isIManageConfigured } from './core';

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
      headers: getAuthHeaders(),
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
