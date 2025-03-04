
import { toast } from 'sonner';

type FileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>, setContent: (content: string) => void) => void;

export const handleFileUpload: FileUploadHandler = (e, setContent) => {
  // This is a disabled handler that doesn't do anything since file upload is removed
  toast.info('File upload functionality has been disabled');
  return;
};

export default handleFileUpload;
