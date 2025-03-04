
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, FileText } from 'lucide-react';
import { toast } from 'sonner';
import FilePreview from '@/components/FilePreview';

interface FileUploadSectionProps {
  file: File | null;
  fileError: string | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isProcessing: boolean;
  onClearFile: () => void;
}

const FileUploadSection = ({
  file,
  fileError,
  previewUrl,
  fileInputRef,
  isProcessing,
  onClearFile
}: FileUploadSectionProps) => {
  const [importTab, setImportTab] = useState('upload');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleGoogleDocImport = () => {
    if (!googleDocUrl.trim()) {
      toast.error('Please enter a Google Doc URL');
      return;
    }
    
    if (!googleDocUrl.includes('docs.google.com')) {
      toast.error('Please enter a valid Google Doc URL');
      return;
    }
    
    setIsImporting(true);
    
    // Simulate API call to import Google Doc
    // In a real implementation, you would use Google Docs API
    setTimeout(() => {
      const mockDocData = new Blob([`Content imported from Google Doc: ${googleDocUrl}`], 
                                   { type: 'text/plain' });
      
      // Create a File object from the Blob
      const mockFile = new File([mockDocData], 'google-doc-import.txt', { type: 'text/plain' });
      
      // Trigger the file input change handler
      if (fileInputRef.current) {
        // Create a DataTransfer object to set files on the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        fileInputRef.current.files = dataTransfer.files;
        
        // Dispatch change event
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
      
      setIsImporting(false);
      setGoogleDocUrl('');
      toast.success('Google Doc imported successfully');
    }, 1500);
  };

  return (
    <>
      {!file ? (
        <div className="mb-6 border rounded-lg p-4">
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
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
                className="hidden"
                disabled={isProcessing}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                disabled={isProcessing}
                className="w-full"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Browse for files
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                or drag files to the query box
              </p>
            </TabsContent>
            
            <TabsContent value="google" className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="url"
                  value={googleDocUrl}
                  onChange={(e) => setGoogleDocUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  disabled={isProcessing}
                  className="w-full"
                />
                <Button 
                  onClick={handleGoogleDocImport} 
                  disabled={isProcessing || isImporting}
                  className="w-full"
                >
                  {isImporting ? 'Importing...' : 'Import from Google Docs'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Paste the URL of your Google Doc to import its content
              </p>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <FilePreview 
          file={file}
          previewUrl={previewUrl}
          fileError={fileError}
          onClearFile={onClearFile}
        />
      )}
      
      {/* Hidden file input element */}
      {file && (
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
          className="hidden"
          disabled={isProcessing}
        />
      )}
    </>
  );
};

export default FileUploadSection;

