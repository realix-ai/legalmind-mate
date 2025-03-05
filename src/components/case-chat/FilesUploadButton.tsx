
import { useState, useRef } from 'react';
import { FileUp, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface FilesUploadButtonProps {
  onFilesUploaded: (files: File[]) => void;
  isDisabled?: boolean;
}

const FilesUploadButton = ({ onFilesUploaded, isDisabled = false }: FilesUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        
        // Continue with valid files
        onFilesUploaded(validFiles);
        toast.success(`${validFiles.length} file${validFiles.length === 1 ? '' : 's'} uploaded`);
      } else {
        // All files are valid
        onFilesUploaded(files);
        toast.success(`${files.length} file${files.length === 1 ? '' : 's'} uploaded`);
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsUploading(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="button"
            size="icon"
            variant="ghost"
            disabled={isDisabled || isUploading}
            className="hover:bg-primary/10"
            onClick={handleButtonClick}
          >
            {isUploading ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload files</p>
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

export default FilesUploadButton;
