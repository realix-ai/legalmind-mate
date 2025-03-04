
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { saveCustomTemplate } from '@/utils/documents';
import { PlusCircle, FileUp, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateUploadDialogProps {
  onTemplateAdded: () => void;
}

const TemplateUploadDialog = ({ onTemplateAdded }: TemplateUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [importTab, setImportTab] = useState('upload');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please import content first');
      return;
    }
    
    try {
      // Generate default title from timestamp or file info
      const title = `Imported Document ${new Date().toLocaleString()}`;
      const description = 'Imported document';
      
      saveCustomTemplate(title, description, content, 'Custom');
      toast.success('Template uploaded successfully');
      onTemplateAdded();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };
  
  const resetForm = () => {
    setContent('');
    setGoogleDocUrl('');
    setImportTab('upload');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setContent(content);
        toast.success(`File "${file.name}" loaded successfully`);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to read file');
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const handleGoogleDocImport = async () => {
    if (!googleDocUrl.trim()) {
      toast.error('Please enter a Google Doc URL');
      return;
    }
    
    if (!googleDocUrl.includes('docs.google.com')) {
      toast.error('Please enter a valid Google Doc URL');
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Simulate API call to import Google Doc
      // In a real implementation, you would use Google Docs API
      setTimeout(() => {
        const mockDocContent = `This is imported content from Google Doc: ${googleDocUrl}
        
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt,
nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.`;
        
        setContent(mockDocContent);
        toast.success('Google Doc imported successfully');
        setIsImporting(false);
      }, 1500);
    } catch (error) {
      console.error('Error importing Google Doc:', error);
      toast.error('Failed to import Google Doc');
      setIsImporting(false);
    }
  };

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
                <Tabs value={importTab} onValueChange={setImportTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <FileUp className="h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="google" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Google Docs
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full"
                      accept=".txt,.doc,.docx,.rtf,.md"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload a file from your computer (.txt, .doc, .docx, .rtf, .md)
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="google" className="space-y-4">
                    <div className="space-y-3">
                      <Input
                        id="google-doc-url"
                        type="url"
                        value={googleDocUrl}
                        onChange={(e) => setGoogleDocUrl(e.target.value)}
                        placeholder="https://docs.google.com/document/d/..."
                        className="w-full"
                      />
                      <Button 
                        type="button" 
                        onClick={handleGoogleDocImport}
                        disabled={isImporting}
                        className="w-full"
                      >
                        {isImporting ? 'Importing...' : 'Import from Google Docs'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Paste the URL of your Google Doc to import its content
                    </p>
                  </TabsContent>
                </Tabs>
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
