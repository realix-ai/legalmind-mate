
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  getChatMessages, 
  saveChatMessages, 
  clearChatHistory 
} from '@/utils/documents/chat';
import { 
  generateAIResponse 
} from '@/utils/documents/chat/messageGenerator';
import { generateCompletion } from '@/services/openAiService';
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { getCaseDocumentsContent } from '@/utils/documents/caseManager';

export const useChatMessages = (caseId?: string, caseName?: string) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  useEffect(() => {
    if (!caseId) return;
    
    // Load messages from storage
    const loadedMessages = getChatMessages(caseId);
    setMessages(loadedMessages);
    
    // Add welcome message if no messages exist
    if (loadedMessages.length === 0) {
      const welcomeMessage: ChatMessageProps = {
        id: uuidv4(),
        sender: 'ai',
        content: `Hello! I'm your AI assistant for the case "${caseName || 'Untitled'}". How can I help you today?`,
        timestamp: new Date().getTime()
      };
      
      saveChatMessages(caseId, [welcomeMessage]);
      setMessages([welcomeMessage]);
    }
  }, [caseId, caseName]);
  
  const handleSendMessage = useCallback(async (content: string, files?: File[]) => {
    if (!caseId || !content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessageProps = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date().getTime()
    };
    
    const updatedMessages = [...messages, userMessage];
    saveChatMessages(caseId, updatedMessages);
    setMessages(updatedMessages);
    
    // Generate AI response
    setIsAiTyping(true);
    
    try {
      // Check if OpenAI API is configured
      const apiKey = localStorage.getItem('openai-api-key');
      let aiResponseContent = '';
      
      if (apiKey) {
        // Get previous messages for context (max 5)
        const recentMessages = messages.slice(-5).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
        
        // Get case documents content
        const caseDocuments = getCaseDocumentsContent(caseId);
        
        // Create document context information
        let documentContext = '';
        if (caseDocuments.length > 0) {
          documentContext = `\nCase documents (${caseDocuments.length}):\n`;
          caseDocuments.forEach((doc, index) => {
            documentContext += `Document ${index + 1}: "${doc.title}"\n`;
            documentContext += `Content: ${doc.content.substring(0, 500)}${doc.content.length > 500 ? '...' : ''}\n\n`;
          });
        }
        
        // Create context-aware prompt
        const contextPrompt = `
You are an AI legal assistant helping with a case named "${caseName || 'Untitled'}".
Previous conversation:
${recentMessages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}
${documentContext}
USER: ${content}
`;

        const systemPrompt = `You are a knowledgeable legal assistant with expertise in case management, legal research, and document preparation. 
Provide helpful, accurate, and professional responses to legal questions. 
Be concise but thorough, focusing on relevant legal principles, cases, and practical advice.
When documents are provided, reference them specifically in your response.`;
        
        const openAiResponse = await generateCompletion(contextPrompt, systemPrompt);
        
        if (openAiResponse) {
          aiResponseContent = openAiResponse;
        } else {
          throw new Error('Failed to generate content with ChatGPT');
        }
      } else {
        // Use mock response for files or without API key
        if (files && files.length > 0) {
          // Call the mock function with the correct arguments (caseId, caseName, messages, files)
          aiResponseContent = await generateAIResponse(caseId, caseName || 'Untitled', updatedMessages, files);
        } else {
          // Call the mock function with just the basic arguments
          aiResponseContent = await generateAIResponse(caseId, caseName || 'Untitled', updatedMessages);
        }
      }
      
      // Add AI response
      const aiMessage: ChatMessageProps = {
        id: uuidv4(),
        sender: 'ai',
        content: aiResponseContent,
        timestamp: new Date().getTime()
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      saveChatMessages(caseId, finalMessages);
      setMessages(finalMessages);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsAiTyping(false);
    }
  }, [caseId, caseName, messages]);
  
  const handleNewDialog = useCallback(() => {
    if (!caseId) return;
    
    // Clear chat history and start new
    clearChatHistory(caseId);
    
    // Add welcome message
    const welcomeMessage: ChatMessageProps = {
      id: uuidv4(),
      sender: 'ai',
      content: `Hello! I'm your AI assistant for the case "${caseName || 'Untitled'}". How can I help you today?`,
      timestamp: new Date().getTime()
    };
    
    saveChatMessages(caseId, [welcomeMessage]);
    setMessages([welcomeMessage]);
    
    toast.success('Started new conversation');
  }, [caseId, caseName]);
  
  return {
    messages,
    isAiTyping,
    handleSendMessage,
    handleNewDialog
  };
};
