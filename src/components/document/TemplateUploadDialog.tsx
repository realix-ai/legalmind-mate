
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { saveCustomTemplate } from '@/utils/documents';
import { PlusCircle, FileUp, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateUploadDialogProps {
  onTemplateAdded: () => void;
}

const TemplateUploadDialog = ({ onTemplateAdded }: TemplateUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Custom');
  const [importTab, setImportTab] = useState('upload');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a template title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter template content');
      return;
    }
    
    try {
      saveCustomTemplate(title, description, content, category);
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
    setTitle('');
    setDescription('');
    setContent('');
    setCategory('Custom');
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
        
        // Try to extract a title from the file name
        if (!title && file.name) {
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          setTitle(fileName);
        }
        
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
        
        // Try to extract a title from the URL
        if (!title) {
          const urlParts = googleDocUrl.split('/');
          const docId = urlParts[urlParts.length - 2] || 'Imported Document';
          setTitle(`Google Doc - ${docId}`);
        }
        
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
            <DialogTitle>Upload Custom Template</DialogTitle>
            <DialogDescription>
              Upload your own document template to use in future documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Template title"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Brief description"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Custom">Custom</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Litigation">Litigation</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="IP">IP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 min-h-[200px]"
                placeholder="Enter template content or import from file/Google Docs"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUploadDialog;

