
import { toast } from 'sonner';

type FileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>, setContent: (content: string) => void) => void;

export const handleFileUpload: FileUploadHandler = (e, setContent) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File is too large. Maximum size is 5MB');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      setContent(content);
      toast.success(`File "${file.name}" loaded successfully`);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file');
    }
  };
  
  reader.onerror = () => {
    toast.error('Error reading file');
  };
  
  reader.readAsText(file);
};

export default handleFileUpload;
