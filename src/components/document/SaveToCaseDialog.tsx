import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
import { 
  saveDocument, 
  getCases, 
  createCase,
  normalizeCaseId
} from '@/utils/documents';

interface SaveToCaseDialogProps {
  title: string;
  content: string;
  currentDocumentId: string | null;
  onSaved: (documentId: string) => void;
}

const SaveToCaseDialog = ({ 
  title, 
  content,
  currentDocumentId,
  onSaved
}: SaveToCaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [cases, setCases] = useState<{id: string, name: string}[]>([]);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [newCaseName, setNewCaseName] = useState('');
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  
  useEffect(() => {
    if (open) {
      const availableCases = getCases();
      setCases(availableCases);
      if (availableCases.length > 0) {
        setSelectedCase(availableCases[0].id);
      } else {
        setIsCreatingCase(true);
      }
    }
  }, [open]);
  
  const handleSave = () => {
    try {
      let caseId = selectedCase;
      
      if (isCreatingCase) {
        if (!newCaseName.trim()) {
          toast.error("Case name required", {
            description: "Please enter a name for the new case."
          });
          return;
        }
        
        const newCase = createCase(newCaseName);
        caseId = newCase.id;
      }
      
      // Ensure we have a valid documentTitle
      const finalDocumentTitle = title.trim() || "Untitled Document";
      
      // Debug output
      console.log("Original document title:", title);
      console.log("Final document title:", finalDocumentTitle);
      console.log("Document content length:", content.length);
      console.log("Current document ID:", currentDocumentId);
      console.log("Saving document to case ID:", caseId);
      
      // Normalize the case ID before saving
      const normalizedCaseId = normalizeCaseId(caseId);
      console.log("Normalized case ID:", normalizedCaseId);
      
      // Save document with normalized case ID
      const saved = saveDocument(finalDocumentTitle, content, currentDocumentId, normalizedCaseId);
      
      console.log("Document saved:", saved);
      toast.success(`Document saved to ${isCreatingCase ? `new case "${newCaseName}"` : 'the selected case'}`);
      
      setOpen(false);
      onSaved(saved.id);
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("There was an error saving your document.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
        >
          Save to Case
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Document to Case</DialogTitle>
          <DialogDescription>
            Select an existing case or create a new one.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {cases.length > 0 && !isCreatingCase && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="case" className="text-right">
                Case
              </Label>
              <Select value={selectedCase} onValueChange={setSelectedCase}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {!isCreatingCase && cases.length > 0 && (
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setIsCreatingCase(true)}
                className="text-xs gap-1"
              >
                <Plus className="h-3 w-3" /> Create New Case
              </Button>
            </div>
          )}
          
          {(isCreatingCase || cases.length === 0) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newCase" className="text-right">
                New Case
              </Label>
              <Input
                id="newCase"
                value={newCaseName}
                onChange={(e) => setNewCaseName(e.target.value)}
                className="col-span-3"
                placeholder="Enter case name"
              />
            </div>
          )}
          
          {isCreatingCase && cases.length > 0 && (
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setIsCreatingCase(false)}
                className="text-xs"
              >
                Back to Existing Cases
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save Document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToCaseDialog;
