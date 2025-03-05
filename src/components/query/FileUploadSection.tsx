
import { toast } from 'sonner';

interface FileUploadSectionProps {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  setFileError: (error: string | null) => void;
}

const FileUploadSection = ({ uploadedFiles, setUploadedFiles, setFileError }: FileUploadSectionProps) => {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-2 bg-muted rounded-md">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">
          Uploaded Files ({uploadedFiles.length})
        </div>
        <button
          type="button"
          className="text-sm text-destructive hover:underline"
          onClick={() => {
            setUploadedFiles([]);
            setFileError(null);
          }}
        >
          Remove All
        </button>
      </div>
      <div className="space-y-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex justify-between items-center text-sm p-1.5 bg-background rounded">
            <span className="truncate max-w-[240px]">{file.name}</span>
            <button
              type="button"
              className="text-xs text-destructive hover:underline"
              onClick={() => {
                const newFiles = [...uploadedFiles];
                newFiles.splice(index, 1);
                setUploadedFiles(newFiles);
                if (newFiles.length === 0) {
                  setFileError(null);
                }
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadSection;
