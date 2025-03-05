
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
  files: File[]
): Promise<QueryResponse> {
  console.log(`LegalQueryService: Processing ${queryType} query: ${queryText}`);
  
  try {
    if (files && files.length > 0) {
      console.log(`LegalQueryService: Processing ${files.length} files`);
      
      // Process multiple files and combine results
      const fileResults = await Promise.all(
        files.map(file => processFileWithQuerySafe(file, queryText, queryType))
      );
      
      // Combine all file results
      const combinedResponse = fileResults.join('\n\n---\n\n');
      console.log("LegalQueryService: All files processed");
      
      return {
        content: combinedResponse,
        status: 'success'
      };
    } else {
      // Just process the query without file
      console.log("LegalQueryService: Processing query without files...");
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

// Safe version of processFileWithQuery that catches individual file errors
async function processFileWithQuerySafe(
  file: File, 
  queryText: string, 
  queryType: QueryType
): Promise<string> {
  try {
    const result = await processFileWithQuery(file, queryText, queryType);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `ERROR PROCESSING FILE ${file.name}: ${errorMessage}`;
  }
}
