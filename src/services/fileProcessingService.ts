
import { QueryType } from "./legalQueryService";
import { getFileAnalysisResponse } from "./responseGenerationService";
import { simulateApiCall } from "./queryProcessingService";

// Process file and query together
export async function processFileWithQuery(file: File, query: string, queryType: QueryType): Promise<string> {
  console.log("FileProcessingService: Inside processFileWithQuery function");
  
  // Simulate file processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Read the file content (for text files)
  let fileContent = '';
  const fileTypeInfo = getFileTypeInfo(file);
  console.log("FileProcessingService: Detected file type:", fileTypeInfo);
  
  try {
    if (fileTypeInfo.isText) {
      console.log("FileProcessingService: Reading text file content...");
      fileContent = await readFileAsText(file);
      console.log("FileProcessingService: File content preview:", 
        fileContent.substring(0, 100) + (fileContent.length > 100 ? "..." : ""));
    } else if (fileTypeInfo.isImage) {
      console.log("FileProcessingService: Processing image file...");
      fileContent = '[Image analysis would be performed here]';
    } else if (fileTypeInfo.isPdf) {
      console.log("FileProcessingService: Processing PDF file...");
      fileContent = '[PDF content extraction would be performed here]';
    } else {
      console.log("FileProcessingService: Unknown file type:", file.type);
      fileContent = '[Unknown file type]';
    }
  } catch (error) {
    console.error('FileProcessingService: Error processing file:', error);
    throw new Error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Generate a response based on file type and query
  const fileTypeResponse = getFileAnalysisResponse(file.type || file.name, queryType);
  
  const finalResponse = `ANALYSIS OF UPLOADED FILE: ${file.name}\n\n${fileTypeResponse}\n\nRELATED TO QUERY: "${query}"\n\n${await simulateApiCall(query, queryType)}`;
  console.log("FileProcessingService: Generated file analysis response");
  
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
    
    reader.readAsText(file);
  });
}
