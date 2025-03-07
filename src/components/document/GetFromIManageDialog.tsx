
import { useState, useEffect } from 'react';
import { Cloud, Search, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { checkIManageConnection, searchIManageDocuments, fetchDocumentFromIManage } from '@/services/iManageService';
import { SavedDocument } from '@/utils/documents/types';

interface GetFromIManageDialogProps {
  onDocumentSelected: (document: SavedDocument) => void;
  buttonSize?: 'xs' | 'sm' | 'default' | 'lg';
}

const GetFromIManageDialog = ({ 
  onDocumentSelected,
  buttonSize = 'xs'  // Default for the toolbar
}: GetFromIManageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SavedDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  useEffect(() => {
    if (open) {
      checkConnection();
    } else {
      // Reset state when dialog closes
      setSearchQuery('');
      setSearchResults([]);
      setSelectedDocumentId(null);
    }
  }, [open]);
  
  const checkConnection = async () => {
    const connected = await checkIManageConnection();
    setIsConnected(connected);
    if (!connected) {
      toast.error("Not connected to iManage. Please configure your connection first.");
    }
  };
  
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
        setOpen(false);
        toast.success(`Document "${document.title}" loaded from iManage`);
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
  };

  // Adjust the button size and appearance based on where it's used
  const buttonClassName = buttonSize === 'lg' ? 'gap-2' : 'gap-1';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonSize === 'lg' ? 'outline' : 'outline'}
          size={buttonSize}
          className={buttonClassName}
        >
          <Cloud className={buttonSize === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5 mr-1'} />
          {buttonSize === 'lg' ? 'Get from iManage' : 'Get from iManage'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Get Document from iManage</DialogTitle>
          <DialogDescription>
            Search and retrieve documents from your iManage Work repository.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!isConnected ? (
            <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-md">
              Not connected to iManage. Please configure your connection first.
            </div>
          ) : (
            <>
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
              
              {searchResults.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-4 font-medium text-sm">Document</th>
                          <th className="text-left py-2 px-4 font-medium text-sm">Category</th>
                          <th className="text-left py-2 px-4 font-medium text-sm">Last Modified</th>
                          <th className="text-right py-2 px-4 font-medium text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((doc) => (
                          <tr key={doc.id} className="border-t">
                            <td className="py-2 px-4">{doc.title}</td>
                            <td className="py-2 px-4">{doc.category}</td>
                            <td className="py-2 px-4">
                              {new Date(doc.lastModified).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 text-right">
                              <Button 
                                size="sm" 
                                onClick={() => handleDocumentSelect(doc.id)}
                                disabled={isLoading && selectedDocumentId === doc.id}
                              >
                                {isLoading && selectedDocumentId === doc.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  'Select'
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
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
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GetFromIManageDialog;
