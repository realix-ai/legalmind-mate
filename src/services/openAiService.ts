
import { toast } from "sonner";

// Types for OpenAI API requests and responses
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAICompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Configuration for OpenAI API
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini'; // Using a modern model that's efficient

/**
 * Generates a completion from the OpenAI API
 */
export async function generateCompletion(
  prompt: string,
  systemPrompt: string,
  model: string = DEFAULT_MODEL
): Promise<string | null> {
  // API key should be provided by the user
  const apiKey = localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    toast.error("OpenAI API key not configured. Please add it in settings.");
    return null;
  }
  
  try {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];
    
    const requestBody: OpenAICompletionRequest = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1500
    };
    
    console.log('Sending request to OpenAI API:', {
      model,
      promptLength: prompt.length,
      systemPromptLength: systemPrompt.length
    });
    
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data: OpenAICompletionResponse = await response.json();
    console.log('OpenAI API response:', {
      model: data.model,
      tokensUsed: data.usage.total_tokens
    });
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    toast.error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Get the appropriate system prompt based on query type
export function getSystemPromptForQueryType(queryType: string): string {
  switch (queryType) {
    case 'legal-research':
      return `You are an expert legal research assistant. Analyze the following query and provide detailed information on relevant cases, statutes, and legal principles. Include specific citations where applicable. Format your response clearly with numbered points and sections.`;
    
    case 'risk-analysis':
      return `You are a legal risk assessment specialist. Evaluate the following scenario and identify potential legal risks categorized as HIGH, MEDIUM, or LOW. For each risk, provide a brief explanation and suggest risk mitigation strategies. Be thorough and practical in your assessment.`;
    
    case 'summarize':
      return `You are a legal document summarization expert. Create a concise summary of the following information, organizing it into clear sections: CORE ISSUES, KEY PARTIES, PROCEDURAL STATUS, and CRITICAL DOCUMENTS. Be precise and highlight only the most important aspects.`;
    
    case 'data-analysis':
      return `You are a legal data analyst. Examine the following query and provide statistical insights, jurisdiction-specific information, litigation cost projections, and strategic recommendations based on data patterns. Use bullet points and clear headings to organize your analysis.`;
    
    default:
      return `You are an AI legal assistant. Provide a helpful, accurate, and well-structured response to the following legal query. Include relevant legal principles, case references, and practical advice where appropriate.`;
  }
}
