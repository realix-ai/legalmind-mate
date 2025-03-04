
import { QueryType } from "./legalQueryService";
import { getFileAnalysisResponse } from "./responseGenerationService";
import { simulateApiCall } from "./queryProcessingService";
import { toast } from "sonner";

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Supported file types
const SUPPORTED_FILE_TYPES = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  text: ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/rtf']
};

// Process file and query together
export async function processFileWithQuery(file: File, query: string, queryType: QueryType): Promise<string> {
  console.log("FileProcessingService: Inside processFileWithQuery function");
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const errorMessage = `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    console.error("FileProcessingService:", errorMessage);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Validate file type
  const fileTypeInfo = getFileTypeInfo(file);
  if (!fileTypeInfo.isPdf && !fileTypeInfo.isImage && !fileTypeInfo.isText) {
    const errorMessage = "Unsupported file type. Please upload a PDF, image, or text document.";
    console.error("FileProcessingService:", errorMessage);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Simulate file processing delay with progress feedback
  toast.info("Processing your file...");
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Read the file content (for text files)
  let fileContent = '';
  console.log("FileProcessingService: Detected file type:", fileTypeInfo);
  
  try {
    if (fileTypeInfo.isText) {
      console.log("FileProcessingService: Reading text file content...");
      fileContent = await readFileAsText(file);
      console.log("FileProcessingService: File content preview:", 
        fileContent.substring(0, 100) + (fileContent.length > 100 ? "..." : ""));
    } else if (fileTypeInfo.isImage) {
      console.log("FileProcessingService: Processing image file...");
      toast.info("Analyzing image content...");
      fileContent = '[Image analysis would be performed here]';
    } else if (fileTypeInfo.isPdf) {
      console.log("FileProcessingService: Processing PDF file...");
      toast.info("Extracting PDF content...");
      fileContent = '[PDF content extraction would be performed here]';
    } else {
      console.log("FileProcessingService: Unknown file type:", file.type);
      fileContent = '[Unknown file type]';
    }
  } catch (error) {
    const errorMessage = `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error('FileProcessingService:', errorMessage);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Generate a response based on file type and query
  toast.info("Generating analysis...");
  const fileTypeResponse = getFileAnalysisResponse(file.type || file.name, queryType);
  
  const finalResponse = `ANALYSIS OF UPLOADED FILE: ${file.name}\n\n${fileTypeResponse}\n\nRELATED TO QUERY: "${query}"\n\n${await simulateApiCall(query, queryType)}`;
  console.log("FileProcessingService: Generated file analysis response");
  toast.success("Analysis complete!");
  
  return finalResponse;
}

// Helper function to determine file type
export function getFileTypeInfo(file: File): {isPdf: boolean, isImage: boolean, isText: boolean} {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  console.log("FileProcessingService: Analyzing file type:", { fileName, mimeType });
  
  return {
    isPdf: mimeType.includes('pdf') || fileName.endsWith('.pdf'),
    isImage: mimeType.includes('image') || 
             fileName.endsWith('.jpg') || 
             fileName.endsWith('.jpeg') || 
             fileName.endsWith('.png'),
    isText: mimeType.includes('text') || 
            mimeType.includes('document') ||
            fileName.endsWith('.txt') || 
            fileName.endsWith('.doc') || 
            fileName.endsWith('.docx') || 
            fileName.endsWith('.rtf')
  };
}

// Helper function to read text files
export function readFileAsText(file: File): Promise<string> {
  console.log("FileProcessingService: Reading file as text:", file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      console.log("FileProcessingService: File read successfully");
      resolve(reader.result as string);
    };
    
    reader.onerror = (error) => {
      console.error("FileProcessingService: FileReader error:", error);
      reject(new Error('Failed to read file'));
    };
    
    // Add progress tracking
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        console.log(`FileProcessingService: Loading file - ${percentLoaded}% complete`);
      }
    };
    
    reader.readAsText(file);
  });
}

// Helper function to check if a file type is supported
export function isFileTypeSupported(file: File): boolean {
  const { isPdf, isImage, isText } = getFileTypeInfo(file);
  return isPdf || isImage || isText;
}

// Helper function to get readable file size
export function getReadableFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}
