
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { getConversationContext } from './chatUtils';
import { 
  getDocumentRelatedResponse,
  getFileUploadResponse,
  getUploadInstructionsResponse
} from './documentResponses';
import {
  getDateRelatedResponse,
  getSummaryResponse,
  getGenericResponse
} from './topicResponses';

// Generate AI response based on conversation context and case documents
export const generateAIResponse = async (
  caseId: string,
  caseName: string,
  messages: ChatMessageProps[],
  uploadedFiles?: File[]
): Promise<string> => {
  // Get conversation context
  const context = getConversationContext(messages);
  
  // Get case documents content
  const caseDocuments = getCaseDocumentsContent(caseId);
  console.log(`Found ${caseDocuments.length} documents for case ${caseId}`);
  
  // Extract the last user message
  const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
  const lastUserContent = lastUserMessage?.content || '';
  const lastUserFiles = lastUserMessage?.files || [];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let aiResponse = '';
  
  // Check if user uploaded files in the most recent message
  if (uploadedFiles && uploadedFiles.length > 0) {
    aiResponse = getFileUploadResponse(uploadedFiles, lastUserContent, caseName);
  }
  // Check if user is asking about documents
  else if (lastUserContent.toLowerCase().includes('document') || 
      lastUserContent.toLowerCase().includes('file') || 
      lastUserContent.toLowerCase().includes('content') ||
      lastUserContent.toLowerCase().includes('information')) {
    
    aiResponse = getDocumentRelatedResponse(caseDocuments, caseName, lastUserContent);
  } 
  // Use different response types based on conversation
  else if (lastUserContent.toLowerCase().includes('deadline') || lastUserContent.toLowerCase().includes('date')) {
    aiResponse = getDateRelatedResponse(caseDocuments, caseName);
  }
  else if (lastUserContent.toLowerCase().includes('summary') || lastUserContent.toLowerCase().includes('overview')) {
    aiResponse = getSummaryResponse(caseDocuments, caseName, lastUserContent);
  }
  else if (lastUserContent.toLowerCase().includes('upload') || lastUserContent.toLowerCase().includes('attach')) {
    aiResponse = getUploadInstructionsResponse(caseName);
  }
  else {
    aiResponse = getGenericResponse(caseDocuments, caseName);
  }
  
  return aiResponse;
};

// We need to import this here to avoid circular dependencies
import { getCaseDocumentsContent } from '@/utils/documents/caseManager';

// Re-export all generators for backward compatibility
export * from './chatUtils';
export * from './documentResponses';
export * from './topicResponses';
