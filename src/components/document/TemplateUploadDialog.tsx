
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import ImportTab from './template-upload/ImportTab';
import useTemplateUpload from './template-upload/useTemplateUpload';

interface TemplateUploadDialogProps {
  onTemplateAdded: () => void;
}

const TemplateUploadDialog = ({ onTemplateAdded }: TemplateUploadDialogProps) => {
  const {
    open,
    setOpen,
    content,
    setContent,
    importTab,
    setImportTab,
    googleDocUrl,
    setGoogleDocUrl,
    isImporting,
    handleSubmit,
    fileUploadHandler
  } = useTemplateUpload(onTemplateAdded);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!content.trim()}>Import</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUploadDialog;
