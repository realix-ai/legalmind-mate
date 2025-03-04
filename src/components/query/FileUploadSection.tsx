
import { useRef } from 'react';
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
  return (
    <>
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
        className="hidden"
        disabled={isProcessing}
      />
      
      {file && (
        <FilePreview 
          file={file}
          previewUrl={previewUrl}
          fileError={fileError}
          onClearFile={onClearFile}
        />
      )}
    </>
  );
};

export default FileUploadSection;
