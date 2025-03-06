
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import ImportTab from './template-upload/ImportTab';
import useTemplateUpload from './template-upload/useTemplateUpload';
import { useState, useEffect } from 'react';

interface TemplateUploadDialogProps {
  onTemplateAdded: () => void;
}

const TemplateUploadDialog = ({ onTemplateAdded }: TemplateUploadDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    content,
    setContent,
    importTab,
    setImportTab,
    googleDocUrl,
    setGoogleDocUrl,
    isImporting,
    setIsImporting,
    handleSubmit,
    fileUploadHandler,
    resetForm
  } = useTemplateUpload(onTemplateAdded);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset the form when closing the dialog
      setTimeout(() => {
        resetForm();
      }, 100);
    }
  };

  // Effect to handle dialog auto-close after successful submission
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts when component unmounts
      resetForm();
    };
  }, [resetForm]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          variant="outline"
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Import Document</DialogTitle>
            <DialogDescription>
              Upload a document from your computer or import from Google Docs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Import Method
              </Label>
              <div className="col-span-3">
                <ImportTab 
                  importTab={importTab}
                  setImportTab={setImportTab}
                  googleDocUrl={googleDocUrl}
                  setGoogleDocUrl={setGoogleDocUrl}
                  isImporting={isImporting}
                  setContent={setContent}
                  handleFileUpload={fileUploadHandler}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!content.trim()}
            >
              Import
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUploadDialog;
