
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useCaseLawSearch } from '@/services/caseLawService';
import { toast } from 'sonner';

interface SearchTabProps {
  onInsertCitation: (citation: string) => void;
  onViewCaseDetails: (id: string) => void;
}

export function SearchTab({ onInsertCitation, onViewCaseDetails }: SearchTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the case law search hook
  const { data: searchResults, isLoading: isSearching } = useCaseLawSearch(searchQuery);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be automatically triggered by the useCaseLawSearch hook
    console.log("Searching for:", searchQuery);
  };

  // Insert search result as citation
  const insertSearchResult = (id: string, name: string, citation: string, year: number, court: string) => {
    onInsertCitation(`${name}, ${citation} (${court} ${year})`);
    toast.success('Citation inserted');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search case law..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <ScrollArea className="h-[400px] rounded-md border p-2">
        {isSearching ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div key={result.id} className="p-2 border rounded hover:bg-accent">
                <h4 className="font-semibold text-sm">{result.name}</h4>
                <p className="text-xs text-muted-foreground">{result.citation} ({result.court} {result.year})</p>
                <div className="flex gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => insertSearchResult(
                      result.id, 
                      result.name, 
                      result.citation, 
                      result.year, 
                      result.court
                    )}
                  >
                    Insert Citation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => onViewCaseDetails(result.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="py-8 text-center text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Enter a search term to find relevant case law
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default SearchTab;
