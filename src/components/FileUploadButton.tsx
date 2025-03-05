
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FileUploadButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  hasFile: boolean;
}

const FileUploadButton = ({ onClick, isProcessing, hasFile }: FileUploadButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          type="button"
          size="icon"
          variant="ghost"
          disabled={isProcessing}
          className="hover:bg-primary/10 relative"
          onClick={onClick}
        >
          <FileUp className="h-5 w-5 text-muted-foreground" />
          {hasFile && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Upload a document</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FileUploadButton;
