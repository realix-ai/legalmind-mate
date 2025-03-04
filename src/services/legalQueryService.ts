
import { toast } from "sonner";
import { processFileWithQuery } from "./fileProcessingService";
import { simulateApiCall } from "./queryProcessingService";

export type QueryType = 'legal-research' | 'risk-analysis' | 'summarize' | 'data-analysis';

interface QueryResponse {
  content: string;
  status: 'success' | 'error';
}

// Main function to process legal queries
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
