
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { saveDocumentToIManage, checkIManageConnection } from '@/services/imanage';
import { saveDocument } from '@/utils/documents';

interface SaveToIManageDialogProps {
  title: string;
  content: string;
  category: string;
  currentDocumentId: string | null;
  onSaved: (documentId: string) => void;
}

const SaveToIManageDialog = ({ 
  title, 
  content,
  category,
  currentDocumentId,
  onSaved
}: SaveToIManageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (open) {
      setDocumentTitle(title);
      setDocumentCategory(category);
      checkConnection();
    }
  }, [open, title, category]);
  
  const checkConnection = async () => {
    const connected = await checkIManageConnection();
    setIsConnected(connected);
    if (!connected) {
      toast.error("Not connected to iManage. Please configure your connection first.");
    }
  };
  
  const handleSave = async () => {
    if (!isConnected) {
      toast.error("Please connect to iManage first");
      return;
    }
    
    if (!documentTitle.trim()) {
      toast.error("Document title is required");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save to iManage
      const result = await saveDocumentToIManage(
        documentTitle,
        content,
        documentCategory
      );
      
      if (result.success && result.documentId) {
        // Also save locally with reference to iManage
        const savedDoc = saveDocument(
          documentTitle, 
          content, 
          currentDocumentId,
          undefined,
          documentCategory
        );
        
        // Update with external reference info
        localStorage.setItem(`doc-${savedDoc.id}-external-system`, 'imanage');
        localStorage.setItem(`doc-${savedDoc.id}-external-id`, result.documentId);
        
        toast.success("Document saved to iManage and locally");
        setOpen(false);
        onSaved(savedDoc.id);
      } else {
        toast.error("Failed to save to iManage");
      }
    } catch (error) {
      console.error("Error saving to iManage:", error);
      toast.error("Error saving document to iManage");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="gap-1"
        >
          <Cloud className="h-3.5 w-3.5 mr-1" />
          Save to iManage
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Document to iManage</DialogTitle>
          <DialogDescription>
            Save this document to your iManage Work repository.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-title" className="text-right">
              Title
            </Label>
            <Input
              id="doc-title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="col-span-3"
              placeholder="Document Title"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-category" className="text-right">
              Category
            </Label>
            <Select value={documentCategory} onValueChange={setDocumentCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="memo">Memo</SelectItem>
                <SelectItem value="pleading">Pleading</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {!isConnected && (
            <div className="col-span-4 text-center p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm">
              Not connected to iManage. Please configure your connection first.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !isConnected}
          >
            {isSaving ? 'Saving...' : 'Save to iManage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToIManageDialog;
