
import { toast } from "sonner";

export type QueryType = 'legal-research' | 'risk-analysis' | 'summarize' | 'data-analysis';

interface QueryResponse {
  content: string;
  status: 'success' | 'error';
}

// Function to process legal queries
export async function processLegalQuery(
  queryText: string, 
  queryType: QueryType,
  file: File | null
): Promise<QueryResponse> {
  console.log(`LegalQueryService: Processing ${queryType} query: ${queryText}`);
  
  try {
    if (file) {
      console.log(`LegalQueryService: File details:`, {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      // Process the file
      console.log("LegalQueryService: Starting file processing...");
      const response = await processFileWithQuery(file, queryText, queryType);
      console.log("LegalQueryService: File processing complete");
      
      return {
        content: response,
        status: 'success'
      };
    } else {
      // Just process the query without file
      console.log("LegalQueryService: Processing query without file...");
      const response = await simulateApiCall(queryText, queryType);
      console.log("LegalQueryService: Query processing complete");
      
      return {
        content: response,
        status: 'success'
      };
    }
  } catch (error) {
    console.error('LegalQueryService: Error processing query:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to process your legal query: ${errorMessage}`);
    return {
      content: `An error occurred while processing your query: ${errorMessage}`,
      status: 'error'
    };
  }
}

// Process file and query together
async function processFileWithQuery(file: File, query: string, queryType: QueryType): Promise<string> {
  console.log("LegalQueryService: Inside processFileWithQuery function");
  
  // Simulate file processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Read the file content (for text files)
  let fileContent = '';
  const fileTypeInfo = getFileTypeInfo(file);
  console.log("LegalQueryService: Detected file type:", fileTypeInfo);
  
  try {
    if (fileTypeInfo.isText) {
      console.log("LegalQueryService: Reading text file content...");
      fileContent = await readFileAsText(file);
      console.log("LegalQueryService: File content preview:", 
        fileContent.substring(0, 100) + (fileContent.length > 100 ? "..." : ""));
    } else if (fileTypeInfo.isImage) {
      console.log("LegalQueryService: Processing image file...");
      fileContent = '[Image analysis would be performed here]';
    } else if (fileTypeInfo.isPdf) {
      console.log("LegalQueryService: Processing PDF file...");
      fileContent = '[PDF content extraction would be performed here]';
    } else {
      console.log("LegalQueryService: Unknown file type:", file.type);
      fileContent = '[Unknown file type]';
    }
  } catch (error) {
    console.error('LegalQueryService: Error processing file:', error);
    throw new Error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Generate a response based on file type and query
  const fileTypeResponse = getFileAnalysisResponse(file.type || file.name, queryType);
  
  const finalResponse = `ANALYSIS OF UPLOADED FILE: ${file.name}\n\n${fileTypeResponse}\n\nRELATED TO QUERY: "${query}"\n\n${await simulateApiCall(query, queryType)}`;
  console.log("LegalQueryService: Generated file analysis response");
  
  return finalResponse;
}

// Helper function to determine file type
function getFileTypeInfo(file: File): {isPdf: boolean, isImage: boolean, isText: boolean} {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  console.log("LegalQueryService: Analyzing file type:", { fileName, mimeType });
  
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
function readFileAsText(file: File): Promise<string> {
  console.log("LegalQueryService: Reading file as text:", file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      console.log("LegalQueryService: File read successfully");
      resolve(reader.result as string);
    };
    
    reader.onerror = (error) => {
      console.error("LegalQueryService: FileReader error:", error);
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

// Helper function to generate responses based on file type
function getFileAnalysisResponse(fileTypeOrName: string, queryType: QueryType): string {
  console.log("LegalQueryService: Generating file analysis for type/name:", fileTypeOrName);
  
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

// Helper function to simulate API calls for different query types
async function simulateApiCall(query: string, queryType: QueryType): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return different responses based on query type
  switch (queryType) {
    case 'legal-research':
      return `Based on my research, the case "${query}" relates to several key precedents:
        
1. Smith v. Johnson (2018) - Established the modern interpretation of reasonable doubt in similar contexts.

2. Wilson Corp v. Davidson (2020) - Clarified the application of statutory requirements in this area.

3. Parker Trust v. National Bank (2021) - Set important boundaries for fiduciary responsibility that would be relevant here.

The current statutory framework under Section 423(b) would likely apply to this situation, particularly given the 2022 amendments that expanded its scope.`;

    case 'risk-analysis':
      return `Risk Analysis for "${query}":

HIGH RISK FACTORS:
• Potential statute of limitations issues (3-year deadline approaching)
• Conflicting precedents in this jurisdiction
• Recent regulatory changes affecting burden of proof

MEDIUM RISK FACTORS:
• Potential for adverse media coverage
• Similar cases have seen unpredictable outcomes
• Expert testimony may be challenged under Daubert standard

LOW RISK FACTORS:
• Strong documentary evidence available
• Favorable venue selection possible
• Opposing counsel has limited experience in this area

RECOMMENDED RISK MITIGATION STRATEGIES:
1. File protective motions by June 15
2. Prepare alternative settlement scenarios
3. Conduct supplemental research on Johnson v. Metropolitan factors`;

    case 'summarize':
      return `SUMMARY OF "${query}":

CORE ISSUES:
• Breach of fiduciary duty claims relating to investment decisions
• Allegations of improper disclosure of material information
• Disputed timeline of events from 2020-2022

KEY PARTIES:
• Plaintiff corporation (seeking damages of $4.2M)
• Three defendant board members
• Two corporate entities with potential liability

PROCEDURAL STATUS:
• Initial complaint filed March 2023
• Motion to dismiss denied September 2023
• Discovery deadline extended to July 15, 2024
• Trial date set for November 2024

CRITICAL DOCUMENTS:
• Board meeting minutes from April 18, 2021
• Financial disclosure statements from Q3 2021
• Expert witness reports filed February 2024`;

    case 'data-analysis':
      return `DATA ANALYSIS FOR "${query}":

STATISTICAL FINDINGS:
• 72% of similar cases settled before trial
• Average settlement amount: $1.2M
• Median time to resolution: 14 months
• Cases with similar fact patterns had 63% plaintiff success rate

JURISDICTION INSIGHTS:
• This jurisdiction shows 22% higher damage awards than national average
• Recent trend toward stricter interpretation of statutory requirements
• Judge Williamson has ruled on 8 similar cases (5 for plaintiff, 3 for defense)

LITIGATION COST PROJECTION:
• Estimated total costs through trial: $320,000-$420,000
• Major cost drivers: Expert testimony (35%), document review (28%)
• Settlement probability peaks at months 8-10 of litigation

STRATEGIC RECOMMENDATIONS:
1. Consider early mediation (cost/benefit analysis favorable)
2. Allocate resources to key expert testimony areas
3. Prepare detailed timeline exhibits to clarify disputed sequence`;

    default:
      return `I've analyzed your query about "${query}" and compiled relevant information. Would you like me to elaborate on any specific aspect?`;
  }
}
