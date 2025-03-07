
import { useState } from 'react';
import { toast } from 'sonner';
import { searchIManageDocuments, fetchDocumentFromIManage } from '@/services/iManageService';
import { SavedDocument } from '@/utils/documents/types';

export function useIManageSearch(onDocumentSelected: (document: SavedDocument) => void) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SavedDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchIManageDocuments(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("No documents found matching your search");
      }
    } catch (error) {
      console.error("Error searching iManage:", error);
      toast.error("Failed to search iManage documents");
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleDocumentSelect = async (documentId: string) => {
    setSelectedDocumentId(documentId);
    setIsLoading(true);
    
    try {
      // Extract the actual iManage ID from our external ID reference
      const iManageId = documentId.replace('imanage-', '');
      const document = await fetchDocumentFromIManage(iManageId);
      
      if (document) {
        onDocumentSelected(document);
        toast.success(`Document "${document.title}" loaded from iManage`);
        return true;
      } else {
        toast.error("Failed to load document from iManage");
      }
    } catch (error) {
      console.error("Error loading document from iManage:", error);
      toast.error("Error loading document from iManage");
    } finally {
      setIsLoading(false);
      setSelectedDocumentId(null);
    }
    return false;
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isLoading,
    selectedDocumentId,
    handleSearch,
    handleDocumentSelect,
  };
}
