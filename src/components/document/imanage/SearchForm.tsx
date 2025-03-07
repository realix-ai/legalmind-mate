
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => Promise<void>;
  isSearching: boolean;
}

const SearchForm = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  isSearching 
}: SearchFormProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        placeholder="Search documents in iManage..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        disabled={isSearching}
      />
      <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default SearchForm;
