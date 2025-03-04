
import React, { useState } from 'react';
import { Search, ExternalLink, Bookmark, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLegalResearch } from '@/hooks/useLegalResearch';
import { LegalResearchResult } from '@/types/legalResearch';
import { toast } from 'sonner';

interface ResearchToolsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const ResearchToolsPanel = ({ isVisible, onClose }: ResearchToolsPanelProps) => {
  const [query, setQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<'westlaw' | 'lexisnexis' | 'googlescholar'>('westlaw');
  
  const { 
    isLoading, 
    results, 
    searchHistory,
    savedResults,
    performSearch,
    saveResult,
    removeFromSaved
  } = useLegalResearch();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    performSearch(query, selectedTool);
  };
  
  const handleSave = (result: LegalResearchResult) => {
    saveResult(result);
    toast.success('Result saved');
  };
  
  const handleRemoveSaved = (id: string) => {
    removeFromSaved(id);
    toast.success('Result removed from saved');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l shadow-lg z-30 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Legal Research Tools</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <span className="sr-only">Close</span>
          <span aria-hidden="true">&times;</span>
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="research-query" className="text-sm font-medium">
              Search Query
            </label>
            <Input
              id="research-query"
              placeholder="Enter search terms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Search in:</div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={selectedTool === 'westlaw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('westlaw')}
              >
                Westlaw
              </Button>
              <Button
                type="button"
                variant={selectedTool === 'lexisnexis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('lexisnexis')}
              >
                LexisNexis
              </Button>
              <Button
                type="button"
                variant={selectedTool === 'googlescholar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('googlescholar')}
              >
                Google Scholar
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⋮</span> Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" /> Search
              </>
            )}
          </Button>
        </form>
      </div>
      
      <Tabs defaultValue="results" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-3 px-4 py-2 border-b">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="flex-1 overflow-auto p-4">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto opacity-20 mb-4" />
              <h3 className="font-medium mb-1">No results yet</h3>
              <p className="text-sm">Search to find case law, statutes, and legal documents</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{result.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleSave(result)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.citation}</p>
                  <p className="text-sm line-clamp-2 mt-2">{result.snippet}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      {result.source} • {result.date}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7"
                      asChild
                    >
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="flex-1 overflow-auto p-4">
          {savedResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto opacity-20 mb-4" />
              <h3 className="font-medium mb-1">No saved items</h3>
              <p className="text-sm">Save research results for quick access</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{result.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-amber-500"
                      onClick={() => handleRemoveSaved(result.id)}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.citation}</p>
                  <p className="text-sm line-clamp-2 mt-2">{result.snippet}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      {result.source} • {result.date}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7"
                      asChild
                    >
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 overflow-auto p-4">
          {searchHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto opacity-20 mb-4" />
              <h3 className="font-medium mb-1">No search history</h3>
              <p className="text-sm">Your search history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setQuery(item.query);
                    setSelectedTool(item.source);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.query}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{item.source}</span>
                        <Separator orientation="vertical" className="h-3 mx-2" />
                        <span>{item.date}</span>
                        <Separator orientation="vertical" className="h-3 mx-2" />
                        <span>{item.resultCount} results</span>
                      </div>
                    </div>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResearchToolsPanel;
