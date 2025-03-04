
import { QueryType } from "./legalQueryService";

// Helper function to generate responses based on file type
export function getFileAnalysisResponse(fileTypeOrName: string, queryType: QueryType): string {
  console.log("ResponseGenerationService: Generating file analysis for type/name:", fileTypeOrName);
  
  if (fileTypeOrName.includes('pdf') || fileTypeOrName.endsWith('.pdf')) {
    return 'PDF ANALYSIS: This document contains several legal clauses and provisions that relate to your query. The most relevant sections appear on pages 3-5 which discuss liability limitations and jurisdiction considerations.';
  } else if (fileTypeOrName.includes('image') || 
            fileTypeOrName.endsWith('.jpg') || 
            fileTypeOrName.endsWith('.jpeg') || 
            fileTypeOrName.endsWith('.png')) {
    return 'IMAGE ANALYSIS: The uploaded image appears to contain legal documentation. Visual analysis indicates this may be a contract or agreement with signature blocks visible in the lower section.';
  } else if (fileTypeOrName.includes('doc') || 
            fileTypeOrName.endsWith('.doc') || 
            fileTypeOrName.endsWith('.docx') || 
            fileTypeOrName.endsWith('.txt') || 
            fileTypeOrName.endsWith('.rtf')) {
    return 'DOCUMENT ANALYSIS: This appears to be a legal brief or memorandum with several citations to relevant case law. Key arguments are structured around precedent from Johnson v. Smith and Rogers Corp cases.';
  } else {
    return 'FILE ANALYSIS: The uploaded file has been processed and incorporated into the analysis below.';
  }
}
