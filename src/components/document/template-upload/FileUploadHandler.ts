
import { toast } from 'sonner';

type FileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>, setContent: (content: string) => void) => void;

export const handleFileUpload: FileUploadHandler = (e, setContent) => {
  if (!e.target.files || e.target.files.length === 0) {
    toast.error('No file selected');
    return;
  }
  
  const file = e.target.files[0];
  
  // Check if the file is a valid document type
  const validTypes = [
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/rtf'
  ];
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const isValidByExtension = fileExtension && ['txt', 'md', 'doc', 'docx', 'rtf'].includes(fileExtension);
  
  if (validTypes.includes(file.type) || isValidByExtension) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setContent(event.target.result);
        toast.success(`File uploaded: ${file.name}`);
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      console.error('FileReader error:', reader.error);
    };
    
    reader.readAsText(file);
  } else {
    toast.error(`Unsupported file type: ${file.name}. Please upload .txt, .md, .doc, .docx, or .rtf files.`);
  }
};

export default handleFileUpload;
