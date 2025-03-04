
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
          disabled={true} // Always disabled since we removed file upload
          className="hover:bg-primary/10 relative opacity-50" // Added opacity to show it's disabled
          onClick={onClick}
        >
          <FileUp className="h-5 w-5 text-muted-foreground" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>File upload disabled</p> 
      </TooltipContent>
    </Tooltip>
  );
};

export default FileUploadButton;
