import { ChatMessageProps } from '@/components/case/ChatMessage';
import { MAX_CONTEXT_LENGTH } from './types';
import { getCaseDocumentsContent } from '../caseManager';

// Generate a welcome message based on case data
export const generateWelcomeMessage = (caseName: string): ChatMessageProps => {
  return {
    id: `msg-${Date.now()}`,
    content: `Welcome to case "${caseName}". I have access to all documents associated with this case. How can I assist you today?`,
    sender: 'ai',
    timestamp: Date.now()
  };
};

// Get conversation context (last N messages) for AI generation
export const getConversationContext = (messages: ChatMessageProps[]): string => {
  // Get the last MAX_CONTEXT_LENGTH messages for context
  const contextMessages = messages.slice(-MAX_CONTEXT_LENGTH);
  
  // Format them into a single string for context
  return contextMessages.map(msg => {
    const role = msg.sender === 'user' ? 'User' : 'Assistant';
    let message = `${role}: ${msg.content}`;
    
    // Add file information if present
    if (msg.files && msg.files.length > 0) {
      message += `\n[Attached ${msg.files.length} file(s): ${msg.files.map(f => f.name).join(', ')}]`;
    }
    
    return message;
  }).join('\n\n');
};

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

// Helper function to generate file upload response
const getFileUploadResponse = (
  uploadedFiles: File[],
  lastUserContent: string,
  caseName: string
): string => {
  let response = `I've received ${uploadedFiles.length} file${uploadedFiles.length === 1 ? '' : 's'} from you:\n\n`;
  
  uploadedFiles.forEach((file, index) => {
    response += `${index + 1}. **${file.name}** (${(file.size / 1024).toFixed(1)} KB)\n`;
    
    // Add file type specific response
    if (file.type.includes('pdf')) {
      response += `   This appears to be a PDF document. I can see the contents of this document.\n\n`;
    } else if (file.type.includes('image')) {
      response += `   This appears to be an image. I can see what's in this image.\n\n`;
    } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      response += `   This appears to be a Word document. I can see the contents of this document.\n\n`;
    } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
      response += `   This appears to be a text file. I can see the contents of this file.\n\n`;
    } else {
      response += `   I can see the contents of this file.\n\n`;
    }
  });
  
  // Add a response to their message if they included text
  if (lastUserContent.trim()) {
    response += `\nRegarding your message: "${lastUserContent}"\n\n`;
    
    // Add a contextual response based on the message
    if (lastUserContent.toLowerCase().includes('analyze') || 
        lastUserContent.toLowerCase().includes('review')) {
      response += `I'll help analyze these files in the context of your case "${caseName}". The documents appear to contain information relevant to your case. Let me know if you need any specific details from them.`;
    } else if (lastUserContent.toLowerCase().includes('summarize')) {
      response += `I'll summarize the key points from these files for your case "${caseName}". The documents contain information that could be useful for your legal strategy. Let me know if you'd like me to focus on any particular aspects.`;
    } else {
      response += `I'll review these files in relation to your case "${caseName}". They contain information that might be relevant to your legal matters. Feel free to ask me specific questions about the content.`;
    }
  } else {
    // Generic response if no message text
    response += `I've added these files to the case "${caseName}". Would you like me to analyze their contents or extract specific information from them?`;
  }
  
  // Note about file storage
  response += `\n\nNote: These files are now associated with this conversation session. You can reference them in future messages.`;
  
  return response;
};

// Helper function to generate document-related response
const getDocumentRelatedResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string,
  lastUserContent: string
): string => {
  if (caseDocuments.length === 0) {
    return `I don't see any documents associated with "${caseName}" yet. You can add documents by:
    
1. Using the document drafting page to create new documents
2. Uploading files directly in this chat using the paperclip icon below
3. Importing existing documents from other sources

Would you like me to help you create a new document for this case?`;
  } else {
    // Construct response based on available documents
    let response = `I found ${caseDocuments.length} document(s) related to case "${caseName}":\n\n`;
    
    caseDocuments.forEach((doc, index) => {
      response += `${index + 1}. "${doc.title}"\n`;
      
      // Add a short excerpt from each document (first 100 chars)
      const excerpt = doc.content.substring(0, 100).trim();
      response += `   Excerpt: "${excerpt}${doc.content.length > 100 ? '...' : ''}"\n\n`;
    });
    
    // Attempt to answer the specific query based on document content
    if (lastUserContent.toLowerCase().includes('summary') || lastUserContent.toLowerCase().includes('summarize')) {
      response += `\nHere's a brief summary of the documents: The documents appear to be related to ${
        caseDocuments[0].title.includes('contract') ? 'contractual matters' : 
        caseDocuments[0].title.includes('legal') ? 'legal proceedings' : 
        'case-relevant information'
      }. Would you like me to analyze any specific document in more detail?`;
    }
    
    return response;
  }
};

// Helper function to generate date-related response
const getDateRelatedResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string
): string => {
  let response = `Based on our previous conversation about "${caseName}", I notice there are some important deadlines coming up. The main filing deadline appears to be ${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}.`;
  
  // Add document-specific date information if available
  if (caseDocuments.length > 0) {
    const docsWithDates = caseDocuments.filter(doc => 
      doc.content.toLowerCase().includes('date') || 
      doc.content.toLowerCase().includes('deadline') ||
      doc.content.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
    );
    
    if (docsWithDates.length > 0) {
      response += `\n\nI also found date references in ${docsWithDates.length} of your case documents that might be relevant.`;
    }
  }
  
  return response;
};

// Helper function to generate summary response
const getSummaryResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string,
  lastUserContent: string
): string => {
  let response = `Here's a summary of case "${caseName}" based on our discussion so far:\n\n1. Case involves ${['contract dispute', 'intellectual property', 'employment law', 'regulatory compliance'][Math.floor(Math.random() * 4)]}\n2. Current stage: ${['Initial filing', 'Discovery', 'Pre-trial', 'Settlement negotiation'][Math.floor(Math.random() * 4)]}\n3. Key concerns we've discussed: ${lastUserContent.substring(0, 20)}...`;
  
  // Add document count if available
  if (caseDocuments.length > 0) {
    response += `\n4. Case has ${caseDocuments.length} associated document(s)`;
  }
  
  return response;
};

// Helper function to generate upload instructions response
const getUploadInstructionsResponse = (caseName: string): string => {
  return `You can upload files to this case by clicking the paperclip icon in the message input area. This allows you to:

1. Upload PDF documents
2. Upload Word documents (.doc, .docx)
3. Upload text files (.txt)
4. Upload images (.jpg, .png)

Files you upload will be associated with this conversation and I can help analyze their contents in the context of your case "${caseName}".`;
};

// Helper function to generate generic response
const getGenericResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string
): string => {
  // Generic responses that reference previous conversation and documents
  const responses = [
    `Based on what we've discussed about "${caseName}" so far, I think we should focus on the ${['legal strategy', 'document preparation', 'witness statements', 'settlement options'][Math.floor(Math.random() * 4)]}.`,
    `Continuing our analysis of "${caseName}", I'd recommend looking into the ${['jurisdictional issues', 'procedural requirements', 'statutory deadlines', 'evidentiary standards'][Math.floor(Math.random() * 4)]}.`,
    `Given the context of our conversation about "${caseName}", the next steps could include ${['filing a motion', 'preparing discovery requests', 'interviewing witnesses', 'researching similar cases'][Math.floor(Math.random() * 4)]}.`,
    `To address the concerns you've raised about "${caseName}", we should consider ${['alternative dispute resolution', 'amending the complaint', 'requesting an extension', 'consulting an expert witness'][Math.floor(Math.random() * 4)]}.`
  ];
  
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Add reference to documents if available
  if (caseDocuments.length > 0) {
    response += `\n\nBy the way, I have access to ${caseDocuments.length} document(s) associated with this case. Let me know if you'd like me to provide information from any of them.`;
  }
  
  // Remind about file upload capability
  response += `\n\nRemember, you can also upload files directly to this conversation using the paperclip icon below.`;
  
  return response;
};
