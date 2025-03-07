
import { Loader2 } from 'lucide-react';
import SearchForm from './SearchForm';
import SearchResultsTable from './SearchResultsTable';
import { SavedDocument } from '@/utils/documents/types';

interface SearchContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SavedDocument[];
  isSearching: boolean;
  isLoading: boolean;
  selectedDocumentId: string | null;
  handleSearch: () => Promise<void>;
  handleDocumentSelect: (documentId: string) => Promise<boolean | undefined>;
}

const SearchContent = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  isLoading,
  selectedDocumentId,
  handleSearch,
  handleDocumentSelect
}: SearchContentProps) => {
  return (
    <>
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
      
      <SearchResultsTable
        results={searchResults}
        isLoading={isLoading}
        selectedDocumentId={selectedDocumentId}
        onDocumentSelect={handleDocumentSelect}
      />
      
      {isSearching && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {!isSearching && searchResults.length === 0 && searchQuery && (
        <div className="text-center p-8 text-muted-foreground">
          No documents found matching your search.
        </div>
      )}
    </>
  );
};

export default SearchContent;
