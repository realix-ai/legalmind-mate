
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  hasFile: boolean;
}

const FileUploadButton = ({ onClick, isProcessing, hasFile }: FileUploadButtonProps) => {
  return (
    <Button 
      type="button"
      size="icon"
      variant="ghost"
      disabled={isProcessing}
      className="hover:bg-primary/10 relative"
      onClick={onClick}
    >
      <FileUp className={`h-5 w-5 ${hasFile ? 'text-primary' : ''}`} />
      {hasFile && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
      )}
    </Button>
  );
};

export default FileUploadButton;
