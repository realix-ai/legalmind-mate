
import { FileUp, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImportTabProps {
  importTab: string;
  setImportTab: (tab: string) => void;
  googleDocUrl: string;
  setGoogleDocUrl: (url: string) => void;
  isImporting: boolean;
  setContent: (content: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportTab = ({
  importTab,
  setImportTab,
  googleDocUrl,
  setGoogleDocUrl,
  isImporting,
  setContent,
  handleFileUpload
}: ImportTabProps) => {
  
  const handleGoogleDocImport = async () => {
    if (!googleDocUrl.trim()) {
      toast.error('Please enter a Google Doc URL');
      return;
    }
    
    if (!googleDocUrl.includes('docs.google.com')) {
      toast.error('Please enter a valid Google Doc URL');
      return;
    }
    
    // Simulate API call to import Google Doc
    try {
      // In a real implementation, you would use Google Docs API
      setTimeout(() => {
        const mockDocContent = `This is imported content from Google Doc: ${googleDocUrl}
        
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt,
nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.`;
        
        setContent(mockDocContent);
        toast.success('Google Doc imported successfully');
      }, 1500);
    } catch (error) {
      console.error('Error importing Google Doc:', error);
      toast.error('Failed to import Google Doc');
    }
  };

  return (
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
  );
};

export default ImportTab;
