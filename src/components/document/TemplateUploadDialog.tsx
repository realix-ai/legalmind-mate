
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

  const onFormSubmit = (e: React.FormEvent) => {
    console.log("Form submitted, content length:", content.length);
    handleSubmit(e);
    // Dialog will be closed by the navigation in useTemplateUpload
  };

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
        <form onSubmit={onFormSubmit}>
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

            {content && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Preview
                </Label>
                <div className="col-span-3">
                  <div className="p-3 border rounded-md bg-muted/30 h-40 overflow-auto">
                    <pre className="text-xs whitespace-pre-wrap">{content.substring(0, 500)}{content.length > 500 ? '...' : ''}</pre>
                  </div>
                </div>
              </div>
            )}
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
