
import { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
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
import { SavedDocument } from '@/utils/documents/types';
import { useIManageConnection } from '@/hooks/document/useIManageConnection';
import { useIManageSearch } from '@/hooks/document/useIManageSearch';
import SearchContent from './imanage/SearchContent';

interface GetFromIManageDialogProps {
  onDocumentSelected: (document: SavedDocument) => void;
  buttonSize?: 'xs' | 'sm' | 'default' | 'lg';
}

const GetFromIManageDialog = ({ 
  onDocumentSelected,
  buttonSize = 'xs'  // Reset to 'xs' to match other buttons
}: GetFromIManageDialogProps) => {
  const [open, setOpen] = useState(false);

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    isLoading,
    selectedDocumentId,
    handleSearch,
    handleDocumentSelect
  } = useIManageSearch(onDocumentSelected);
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [open, setSearchQuery, setSearchResults]);
  
  // Connection management
  const { isConnected } = useIManageConnection(open);

  // Handle document selection and close dialog if successful
  const handleSelectDocument = async (documentId: string): Promise<boolean> => {
    const success = await handleDocumentSelect(documentId);
    if (success) {
      setOpen(false);
    }
    return success;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={buttonSize}
          className={buttonSize === 'lg' ? 'gap-2' : 'gap-1'}
        >
          <Cloud className={buttonSize === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
          Get from iManage
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
            <SearchContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              isLoading={isLoading}
              selectedDocumentId={selectedDocumentId}
              handleSearch={handleSearch}
              handleDocumentSelect={handleSelectDocument}
            />
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
