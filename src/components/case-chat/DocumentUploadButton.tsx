
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { saveDocument } from '@/utils/documents';

interface DocumentUploadButtonProps {
  caseId?: string;
  onDocumentUploaded: () => void;
}

const DocumentUploadButton = ({ caseId, onDocumentUploaded }: DocumentUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!caseId) {
      toast.error('No case selected');
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      // Convert FileList to array
      const files = Array.from(e.target.files);
      
      // Validate files
      const MAX_FILES = 5;
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      
      // Check number of files
      if (files.length > MAX_FILES) {
        toast.error(`You can only upload up to ${MAX_FILES} files at once`);
        setIsUploading(false);
        return;
      }
      
      // Check each file
      const invalidFiles: string[] = [];
      
      for (const file of files) {
        // Check file size
        if (file.size > MAX_SIZE) {
          invalidFiles.push(`${file.name} (file size exceeds 10MB)`);
          continue;
        }
        
        // Check file type
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'image/jpeg',
          'image/png'
        ];
        
        if (!validTypes.includes(file.type) && 
            !(file.name.endsWith('.pdf') || 
              file.name.endsWith('.doc') || 
              file.name.endsWith('.docx') || 
              file.name.endsWith('.txt') ||
              file.name.endsWith('.jpg') ||
              file.name.endsWith('.jpeg') ||
              file.name.endsWith('.png'))) {
          invalidFiles.push(`${file.name} (unsupported file type)`);
        }
      }
      
      if (invalidFiles.length > 0) {
        toast.error(
          <div>
            <p>Some files couldn't be uploaded:</p>
            <ul className="mt-1 list-disc list-inside">
              {invalidFiles.map((file, index) => (
                <li key={index} className="text-sm">{file}</li>
              ))}
            </ul>
          </div>
        );
        
        // Filter out invalid files
        const validFiles = files.filter(file => 
          !invalidFiles.some(invalidFile => invalidFile.includes(file.name))
        );
        
        if (validFiles.length === 0) {
          setIsUploading(false);
          return;
        }
        
        // Process and save valid files
        Promise.all(validFiles.map(file => {
          return new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string || 'File content placeholder';
              // Save the document with the file name as title
              saveDocument(file.name, content, null, caseId);
              resolve();
            };
            
            if (file.type.includes('image') || 
                file.name.endsWith('.jpg') || 
                file.name.endsWith('.jpeg') || 
                file.name.endsWith('.png')) {
              reader.readAsDataURL(file);
            } else {
              reader.readAsText(file);
            }
          });
        })).then(() => {
          // All files have been processed
          toast.success(`${validFiles.length} document${validFiles.length === 1 ? '' : 's'} uploaded to case`);
          setIsUploading(false);
          
          // Call the callback to refresh the documents list
          onDocumentUploaded();
        });
      } else {
        // All files are valid
        Promise.all(files.map(file => {
          return new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string || 'File content placeholder';
              // Save the document with the file name as title
              saveDocument(file.name, content, null, caseId);
              resolve();
            };
            
            if (file.type.includes('image') || 
                file.name.endsWith('.jpg') || 
                file.name.endsWith('.jpeg') || 
                file.name.endsWith('.png')) {
              reader.readAsDataURL(file);
            } else {
              reader.readAsText(file);
            }
          });
        })).then(() => {
          // All files have been processed
          toast.success(`${files.length} document${files.length === 1 ? '' : 's'} uploaded to case`);
          setIsUploading(false);
          
          // Call the callback to refresh the documents list
          onDocumentUploaded();
        });
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="button"
            size="sm"
            variant="outline"
            className="flex items-center gap-1 h-8 px-2 text-xs"
            onClick={handleButtonClick}
            disabled={isUploading || !caseId}
          >
            {isUploading ? (
              <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="h-3 w-3" />
            )}
            Upload
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload document to this case</p>
        </TooltipContent>
      </Tooltip>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
    </>
  );
};

export default DocumentUploadButton;
