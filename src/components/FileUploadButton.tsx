
import { useRef } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FileUploadButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  hasFiles: boolean;
}

const FileUploadButton = ({ onClick, isProcessing, hasFiles }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    onClick();
    // Also trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            disabled={isProcessing}
            className="hover:bg-primary/10 relative"
            onClick={handleButtonClick}
          >
            <FileUp className="h-5 w-5 text-muted-foreground" />
            {hasFiles && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload documents or drag files here</p>
        </TooltipContent>
      </Tooltip>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={e => {
          // The file input is hidden, but will trigger this onChange
          // when files are selected
          if (e.target.files && e.target.files.length > 0) {
            // We'll use the onClick handler that was passed in
            // to process the files
            onClick();
          }
        }}
        accept=".pdf,.doc,.docx,.txt,.rtf"
      />
    </>
  );
};

export default FileUploadButton;
