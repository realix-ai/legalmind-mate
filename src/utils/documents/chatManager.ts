import { ChatMessageProps } from '@/components/case/ChatMessage';
import { getCaseDocumentsContent } from './caseManager';

// Maximum number of messages to keep in conversation context
const MAX_CONTEXT_LENGTH = 10;

// Get stored chat messages for a specific case and session
export const getChatMessages = (caseId: string, sessionId?: string): ChatMessageProps[] => {
  // If a sessionId is provided, try to get messages for that session first
  if (sessionId) {
    const sessionMessages = localStorage.getItem(`chat_${caseId}_${sessionId}`);
    if (sessionMessages) {
      try {
        return JSON.parse(sessionMessages);
      } catch (e) {
        console.error('Error parsing session chat messages', e);
      }
    }
  }
  
  // Fall back to the main chat storage
  const savedMessages = localStorage.getItem(`chat_${caseId}`);
  if (!savedMessages) return [];
  
  try {
    return JSON.parse(savedMessages);
  } catch (e) {
    console.error('Error parsing chat messages', e);
    return [];
  }
};

// Save chat messages for a specific case
export const saveChatMessages = (caseId: string, messages: ChatMessageProps[], sessionId?: string): void => {
  // Always save to the main storage
  localStorage.setItem(`chat_${caseId}`, JSON.stringify(messages));
  
  // If a sessionId is provided, also save to that session storage
  if (sessionId) {
    localStorage.setItem(`chat_${caseId}_${sessionId}`, JSON.stringify(messages));
    
    // Update the sessions list
    updateSessionsList(caseId, sessionId, messages[0]?.timestamp || Date.now());
  }
};

// Add a single message to the chat history
export const addChatMessage = (caseId: string, message: ChatMessageProps, sessionId?: string): ChatMessageProps[] => {
  const messages = getChatMessages(caseId, sessionId);
  const updatedMessages = [...messages, message];
  saveChatMessages(caseId, updatedMessages, sessionId);
  return updatedMessages;
};

// Clear chat history for a specific case
export const clearChatHistory = (caseId: string): void => {
  // Clear main chat storage
  localStorage.removeItem(`chat_${caseId}`);
  
  // Clear all sessions for this case
  const sessions = getSessionsList(caseId);
  sessions.forEach(session => {
    localStorage.removeItem(`chat_${caseId}_${session.id}`);
  });
  
  // Clear sessions list
  localStorage.removeItem(`chat_sessions_${caseId}`);
};

// Get the list of sessions for a case
export const getSessionsList = (caseId: string): Array<{id: string, timestamp: number}> => {
  const savedSessions = localStorage.getItem(`chat_sessions_${caseId}`);
  if (!savedSessions) return [];
  
  try {
    return JSON.parse(savedSessions);
  } catch (e) {
    console.error('Error parsing sessions list', e);
    return [];
  }
};

// Update the sessions list for a case
const updateSessionsList = (caseId: string, sessionId: string, timestamp: number): void => {
  const sessions = getSessionsList(caseId);
  
  // Check if session already exists
  const existingSessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (existingSessionIndex >= 0) {
    // Update existing session
    sessions[existingSessionIndex].timestamp = timestamp;
  } else {
    // Add new session
    sessions.push({ id: sessionId, timestamp });
  }
  
  // Sort sessions by timestamp (newest first)
  sessions.sort((a, b) => b.timestamp - a.timestamp);
  
  // Save updated sessions list
  localStorage.setItem(`chat_sessions_${caseId}`, JSON.stringify(sessions));
};

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
    return `${role}: ${msg.content}`;
  }).join('\n\n');
};

// Generate AI response based on conversation context and case documents
export const generateAIResponse = async (
  caseId: string,
  caseName: string,
  messages: ChatMessageProps[]
): Promise<ChatMessageProps> => {
  // Get conversation context
  const context = getConversationContext(messages);
  
  // Get case documents content
  const caseDocuments = getCaseDocumentsContent(caseId);
  console.log(`Found ${caseDocuments.length} documents for case ${caseId}`);
  
  // Extract the last user message
  const lastUserMessage = messages.filter(m => m.sender === 'user').pop()?.content || '';
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let aiResponse = '';
  
  // Check if user is asking about documents
  if (lastUserMessage.toLowerCase().includes('document') || 
      lastUserMessage.toLowerCase().includes('file') || 
      lastUserMessage.toLowerCase().includes('content') ||
      lastUserMessage.toLowerCase().includes('information')) {
    
    if (caseDocuments.length === 0) {
      aiResponse = `I don't see any documents associated with "${caseName}" yet. You can add documents to this case from the document drafting page.`;
    } else {
      // Construct response based on available documents
      aiResponse = `I found ${caseDocuments.length} document(s) related to case "${caseName}":\n\n`;
      
      caseDocuments.forEach((doc, index) => {
        aiResponse += `${index + 1}. "${doc.title}"\n`;
        
        // Add a short excerpt from each document (first 100 chars)
        const excerpt = doc.content.substring(0, 100).trim();
        aiResponse += `   Excerpt: "${excerpt}${doc.content.length > 100 ? '...' : ''}"\n\n`;
      });
      
      // Attempt to answer the specific query based on document content
      if (lastUserMessage.toLowerCase().includes('summary') || lastUserMessage.toLowerCase().includes('summarize')) {
        aiResponse += `\nHere's a brief summary of the documents: The documents appear to be related to ${
          caseDocuments[0].title.includes('contract') ? 'contractual matters' : 
          caseDocuments[0].title.includes('legal') ? 'legal proceedings' : 
          'case-relevant information'
        }. Would you like me to analyze any specific document in more detail?`;
      }
    }
  } 
  // Use different response types based on conversation
  else if (lastUserMessage.toLowerCase().includes('deadline') || lastUserMessage.toLowerCase().includes('date')) {
    aiResponse = `Based on our previous conversation about "${caseName}", I notice there are some important deadlines coming up. The main filing deadline appears to be ${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}.`;
    
    // Add document-specific date information if available
    if (caseDocuments.length > 0) {
      const docsWithDates = caseDocuments.filter(doc => 
        doc.content.toLowerCase().includes('date') || 
        doc.content.toLowerCase().includes('deadline') ||
        doc.content.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
      );
      
      if (docsWithDates.length > 0) {
        aiResponse += `\n\nI also found date references in ${docsWithDates.length} of your case documents that might be relevant.`;
      }
    }
  }
  else if (lastUserMessage.toLowerCase().includes('summary') || lastUserMessage.toLowerCase().includes('overview')) {
    aiResponse = `Here's a summary of case "${caseName}" based on our discussion so far:\n\n1. Case involves ${['contract dispute', 'intellectual property', 'employment law', 'regulatory compliance'][Math.floor(Math.random() * 4)]}\n2. Current stage: ${['Initial filing', 'Discovery', 'Pre-trial', 'Settlement negotiation'][Math.floor(Math.random() * 4)]}\n3. Key concerns we've discussed: ${lastUserMessage.substring(0, 20)}...`;
    
    // Add document count if available
    if (caseDocuments.length > 0) {
      aiResponse += `\n4. Case has ${caseDocuments.length} associated document(s)`;
    }
  }
  else {
    // Generic responses that reference previous conversation and documents
    const responses = [
      `Based on what we've discussed about "${caseName}" so far, I think we should focus on the ${['legal strategy', 'document preparation', 'witness statements', 'settlement options'][Math.floor(Math.random() * 4)]}.`,
      `Continuing our analysis of "${caseName}", I'd recommend looking into the ${['jurisdictional issues', 'procedural requirements', 'statutory deadlines', 'evidentiary standards'][Math.floor(Math.random() * 4)]}.`,
      `Given the context of our conversation about "${caseName}", the next steps could include ${['filing a motion', 'preparing discovery requests', 'interviewing witnesses', 'researching similar cases'][Math.floor(Math.random() * 4)]}.`,
      `To address the concerns you've raised about "${caseName}", we should consider ${['alternative dispute resolution', 'amending the complaint', 'requesting an extension', 'consulting an expert witness'][Math.floor(Math.random() * 4)]}.`
    ];
    
    aiResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add reference to documents if available
    if (caseDocuments.length > 0) {
      aiResponse += `\n\nBy the way, I have access to ${caseDocuments.length} document(s) associated with this case. Let me know if you'd like me to provide information from any of them.`;
    }
  }
  
  return {
    id: `msg-${Date.now()}`,
    content: aiResponse,
    sender: 'ai',
    timestamp: Date.now()
  };
};
