
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, SearchIcon, ExternalLink } from 'lucide-react';
import { 
  getLegalServiceProviders, 
  searchLegalServices, 
  connectLegalService, 
  disconnectLegalService,
  LegalServiceProvider,
  LegalSearchResult 
} from '@/services/legalResearchService';

const LegalServicesPanel = () => {
  const [serviceProviders, setServiceProviders] = useState<LegalServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['westlaw', 'google-scholar']);
  
  useEffect(() => {
    // Load service providers
    setServiceProviders(getLegalServiceProviders());
  }, []);
  
  const handleToggleService = async (serviceId: string, isConnected: boolean) => {
    setIsLoading(true);
    
    try {
      let success;
      if (isConnected) {
        success = await disconnectLegalService(serviceId);
      } else {
        success = await connectLegalService(serviceId);
      }
      
      if (success) {
        setServiceProviders(prevProviders => 
          prevProviders.map(provider => 
            provider.id === serviceId 
              ? { ...provider, isConnected: !isConnected } 
              : provider
          )
        );
      }
    } catch (error) {
      console.error('Error toggling service:', error);
      toast.error('Failed to connect to service');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    if (selectedSources.length === 0) {
      toast.error('Please select at least one source');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const results = await searchLegalServices(searchQuery, selectedSources);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching legal services:', error);
      toast.error('Failed to search legal services');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId) 
        : [...prev, sourceId]
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Legal Research Tools</CardTitle>
        <CardDescription>
          Connect to external legal research services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="search">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter legal research query..."
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                  Search
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {serviceProviders
                  .filter(provider => provider.isConnected)
                  .map(provider => (
                    <div 
                      key={provider.id}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer ${
                        selectedSources.includes(provider.id) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                      onClick={() => toggleSource(provider.id)}
                    >
                      <span>{provider.icon}</span>
                      <span>{provider.name}</span>
                    </div>
                  ))
                }
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-medium">Results ({searchResults.length})</h3>
                  
                  {searchResults.map(result => (
                    <div key={result.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{result.title}</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {result.source}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.citation}</p>
                      
                      <div className="mt-2 space-y-2">
                        {result.snippets.map((snippet, index) => (
                          <p key={index} className="text-sm italic border-l-2 border-primary/40 pl-2 py-1">
                            "{snippet}"
                          </p>
                        ))}
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary flex items-center gap-1"
                        >
                          View on {result.source}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  No results found. Try a different query.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="space-y-4">
              {serviceProviders.map((provider) => (
                <div 
                  key={provider.id}
                  className={`p-3 border rounded-md ${!provider.isAvailable ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{provider.icon}</span>
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-xs text-muted-foreground">{provider.description}</p>
                      </div>
                    </div>
                    
                    <Switch
                      checked={provider.isConnected}
                      onCheckedChange={() => handleToggleService(provider.id, provider.isConnected)}
                      disabled={!provider.isAvailable || isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        Connect to external legal research services to enhance your legal research capabilities.
      </CardFooter>
    </Card>
  );
};

export default LegalServicesPanel;
