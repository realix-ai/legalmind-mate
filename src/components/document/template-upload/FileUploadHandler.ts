
import { toast } from 'sonner';

type FileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>, setContent: (content: string) => void) => void;

export const handleFileUpload: FileUploadHandler = (e, setContent) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    
    // Check if the file is a text file
    if (file.type === 'text/plain' || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setContent(event.target.result);
          toast.success(`File uploaded: ${file.name}`);
        }
      };
      
      reader.onerror = () => {
        toast.error('Error reading file');
      };
      
      reader.readAsText(file);
    } else {
      toast.error('Please upload a text file (.txt or .md)');
    }
  }
};

export default handleFileUpload;
