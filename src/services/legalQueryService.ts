
import { simulateApiCall } from './queryProcessingService';
import { generateCompletion, getSystemPromptForQueryType } from './openAiService';

export type QueryType = 'legal-research' | 'risk-analysis' | 'summarize' | 'data-analysis';

export interface QueryResult {
  content: string;
  status: 'success' | 'error';
}

export async function processLegalQuery(query: string, queryType: QueryType, files: File[] = []): Promise<QueryResult> {
  try {
    console.log("LegalQueryService: Processing", queryType, "query:", query);
    
    // Check if OpenAI API is configured
    const apiKey = localStorage.getItem('openai-api-key');
    let result = '';
    
    if (apiKey) {
      console.log("LegalQueryService: Using OpenAI API");
      
      // Process with OpenAI API
      if (files.length > 0) {
        console.log("LegalQueryService: Processing query with files...");
        // Process files content (in a real app, you'd extract text from files)
        const fileContents = await Promise.all(
          files.map(async (file) => {
            if (file.type.includes('text') || file.name.endsWith('.txt')) {
              return await file.text();
            }
            return `[Content of ${file.name}]`;
          })
        );
        
        // Include file contents in prompt
        const filePrompt = `
Query: ${query}
Document Contents:
${fileContents.join('\n\n')}

Please analyze the above query and document contents.
`;
        
        // Get response from OpenAI
        const systemPrompt = getSystemPromptForQueryType(queryType);
        const response = await generateCompletion(filePrompt, systemPrompt);
        
        result = response || "Failed to get response from AI. Please try again later.";
      } else {
        console.log("LegalQueryService: Processing query without files...");
        
        // Simple query without files
        const systemPrompt = getSystemPromptForQueryType(queryType);
        const response = await generateCompletion(query, systemPrompt);
        
        result = response || "Failed to get response from AI. Please try again later.";
      }
    } else {
      console.log("LegalQueryService: Using mock response (OpenAI API not configured)");
      
      // Fallback to mock data
      result = await simulateApiCall(query, queryType);
    }
    
    console.log("LegalQueryService: Query processing complete");
    return {
      content: result,
      status: 'success'
    };
  } catch (error) {
    console.error("LegalQueryService: Error processing query:", error);
    return {
      content: error instanceof Error ? error.message : "An unknown error occurred",
      status: 'error'
    };
  }
}
