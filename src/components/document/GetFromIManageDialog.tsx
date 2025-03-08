
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GetFromIManageDialogProps {
  onDocumentSelected: (document: SavedDocument) => void;
  buttonSize?: 'xs' | 'sm' | 'default' | 'lg' | 'icon';
  buttonLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const GetFromIManageDialog = ({ 
  onDocumentSelected,
  buttonSize = 'xs',
  buttonLabel = "Get from iManage",
  open,
  onOpenChange
}: GetFromIManageDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isDialogOpen = isControlled ? open : internalOpen;
  const setIsDialogOpen = isControlled ? onOpenChange : setInternalOpen;

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
    if (!isDialogOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isDialogOpen, setSearchQuery, setSearchResults]);
  
  // Connection management
  const { isConnected } = useIManageConnection(isDialogOpen);

  // Handle document selection and close dialog if successful
  const handleSelectDocument = async (documentId: string): Promise<boolean> => {
    const success = await handleDocumentSelect(documentId);
    if (success) {
      setIsDialogOpen(false);
    }
    return success;
  };

  // Render the appropriate button based on size
  const renderTriggerContent = () => {
    if (buttonSize === 'icon') {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          aria-label={buttonLabel}
        >
          <Cloud className="h-5 w-5 text-muted-foreground" />
        </Button>
      );
    }
    
    return (
      <Button
        variant="outline"
        size={buttonSize}
        className={buttonSize === 'lg' ? 'gap-2' : 'gap-1'}
      >
        <Cloud className={buttonSize === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        {buttonLabel}
      </Button>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {!isControlled && (
        buttonSize === 'icon' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {renderTriggerContent()}
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{buttonLabel}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <DialogTrigger asChild>
            {renderTriggerContent()}
          </DialogTrigger>
        )
      )}
      
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
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GetFromIManageDialog;
