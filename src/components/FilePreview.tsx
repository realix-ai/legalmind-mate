
import { X, FileText, Image, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getReadableFileSize, getFileTypeInfo } from '@/services/fileProcessingService';

interface FilePreviewProps {
  file: File;
  previewUrl: string | null;
  fileError: string | null;
  onClearFile: () => void;
}

const FilePreview = ({ file, previewUrl, fileError, onClearFile }: FilePreviewProps) => {
  const fileInfo = getFileTypeInfo(file);
  
  return (
    <div className={`${fileError ? 'bg-destructive/10 border-destructive/50' : 'bg-primary/5'} border rounded-xl p-3 mb-4`}>
      <div className="flex justify-between items-start">
        <div className="flex space-x-3">
          {previewUrl && fileInfo.isImage ? (
            <div className="h-16 w-16 rounded-md overflow-hidden border bg-background flex-shrink-0">
              <img 
                src={previewUrl} 
                alt={file.name} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-md border bg-muted flex items-center justify-center flex-shrink-0">
              {fileInfo.isPdf ? (
                <FileText className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Image className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          )}
          
          <div className="space-y-1 flex-grow overflow-hidden">
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{getReadableFileSize(file.size)}</p>
            {fileError && (
              <p className="text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {fileError}
              </p>
            )}
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClearFile}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
