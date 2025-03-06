
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  getChatMessages, 
  saveChatMessages, 
  clearChatHistory 
} from '@/utils/documents/chat';
import { 
  generateAIResponse as generateMockAiResponse 
} from '@/utils/documents/chat/messageGeneration';
import { generateCompletion } from '@/services/openAiService';

export const useChatMessages = (caseId?: string, caseName?: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  useEffect(() => {
    if (!caseId) return;
    
    // Load messages from storage
    const loadedMessages = getChatMessages(caseId);
    setMessages(loadedMessages);
    
    // Add welcome message if no messages exist
    if (loadedMessages.length === 0) {
      const welcomeMessage = {
        id: uuidv4(),
        type: 'ai',
        content: `Hello! I'm your AI assistant for the case "${caseName || 'Untitled'}". How can I help you today?`,
        timestamp: new Date().toISOString()
      };
      
      saveChatMessages(caseId, [welcomeMessage]);
      setMessages([welcomeMessage]);
    }
  }, [caseId, caseName]);
  
  const handleSendMessage = useCallback(async (content: string) => {
    if (!caseId || !content.trim()) return;
    
    // Add user message
    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
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
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
        
        // Create context-aware prompt
        const contextPrompt = `
You are an AI legal assistant helping with a case named "${caseName || 'Untitled'}".
Previous conversation:
${recentMessages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}

USER: ${content}
`;

        const systemPrompt = `You are a knowledgeable legal assistant with expertise in case management, legal research, and document preparation. 
Provide helpful, accurate, and professional responses to legal questions. 
Be concise but thorough, focusing on relevant legal principles, cases, and practical advice.`;
        
        const openAiResponse = await generateCompletion(contextPrompt, systemPrompt);
        
        if (openAiResponse) {
          aiResponseContent = openAiResponse;
        } else {
          throw new Error('Failed to generate content with ChatGPT');
        }
      } else {
        // Use mock response
        aiResponseContent = generateMockAiResponse(content, messages);
      }
      
      // Add AI response
      const aiMessage = {
        id: uuidv4(),
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date().toISOString()
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
    const welcomeMessage = {
      id: uuidv4(),
      type: 'ai',
      content: `Hello! I'm your AI assistant for the case "${caseName || 'Untitled'}". How can I help you today?`,
      timestamp: new Date().toISOString()
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
