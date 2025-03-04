
import { Search } from 'lucide-react';

interface PromptSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PromptSearch = ({ searchQuery, setSearchQuery }: PromptSearchProps) => {
  return (
    <div className="mb-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search prompts..."
          className="w-full pl-8 pr-3 py-1 text-xs rounded-md border"
        />
      </div>
    </div>
  );
};

export default PromptSearch;
