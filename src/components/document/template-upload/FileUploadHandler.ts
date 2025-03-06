
import { toast } from 'sonner';

type FileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>, setContent: (content: string) => void) => Promise<boolean>;

export const handleFileUpload: FileUploadHandler = async (e, setContent) => {
  if (!e.target.files || e.target.files.length === 0) {
    toast.error('No file selected');
    return false;
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
    try {
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            resolve(event.target.result);
          } else {
            reject(new Error('Failed to read file content'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error(`FileReader error: ${reader.error}`));
        };
        
        reader.readAsText(file);
      });
      
      // Make sure content is not empty
      if (!content.trim()) {
        toast.error(`File is empty: ${file.name}`);
        return false;
      }
      
      setContent(content);
      toast.success(`File uploaded: ${file.name}`);
      return true;
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error reading file');
      return false;
    }
  } else {
    toast.error(`Unsupported file type: ${file.name}. Please upload .txt, .md, .doc, .docx, or .rtf files.`);
    return false;
  }
};

export default handleFileUpload;
