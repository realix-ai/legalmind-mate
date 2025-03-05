
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { 
  getChatMessages, 
  saveChatMessages, 
  generateWelcomeMessage,
  generateAIResponse,
  getSessionsList
} from '@/utils/documents/chatManager';

export function useChatMessages(caseId: string | undefined, caseName: string | undefined) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`);

  // Load existing messages or create welcome message
  useEffect(() => {
    if (!caseId || !caseName) return;

    // Load existing chat messages for the most recent session
    const sessions = getSessionsList(caseId);
    console.log("Available sessions:", sessions);
    
    if (sessions.length > 0) {
      // Use the most recent session by default
      const mostRecentSession = sessions[0];
      setSessionId(mostRecentSession.id);
      
      // Load messages for this session
      const existingMessages = getChatMessages(caseId, mostRecentSession.id);
      if (existingMessages.length > 0) {
        setMessages(existingMessages);
        console.log("Loaded messages for session:", mostRecentSession.id, existingMessages);
      } else {
        // Fallback to welcome message if no messages in the session
        const welcomeMessage = generateWelcomeMessage(caseName);
        setMessages([welcomeMessage]);
        saveChatMessages(caseId, [welcomeMessage], mostRecentSession.id);
      }
    } else {
      // No sessions exist yet, create a new one with welcome message
      const newSessionId = `session-${Date.now()}`;
      setSessionId(newSessionId);
      
      // Add initial welcome message from AI
      const welcomeMessage = generateWelcomeMessage(caseName);
      setMessages([welcomeMessage]);
      saveChatMessages(caseId, [welcomeMessage], newSessionId);
    }
  }, [caseId, caseName]);

  const handleSendMessage = async (currentMessage: string) => {
    if (!caseId || !caseName) return;
    
    // Add user message
    const userMessage: ChatMessageProps = {
      id: `msg-${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatMessages(caseId, updatedMessages, sessionId);
    
    // Simulate AI thinking
    setIsAiTyping(true);
    
    try {
      // Generate context-aware AI response
      const aiResponse = await generateAIResponse(
        caseId,
        caseName,
        updatedMessages
      );
      
      const messagesWithAiResponse = [...updatedMessages, aiResponse];
      setMessages(messagesWithAiResponse);
      saveChatMessages(caseId, messagesWithAiResponse, sessionId);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate AI response');
    } finally {
      setIsAiTyping(false);
    }
  };
  
  const handleNewDialog = () => {
    if (!caseId || !caseName) return;
    
    // Create a new session ID
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    
    // Generate a new welcome message
    const welcomeMessage = generateWelcomeMessage(caseName);
    
    // Reset current messages
    setMessages([welcomeMessage]);
    
    // Save the welcome message to the new session
    saveChatMessages(caseId, [welcomeMessage], newSessionId);
    
    toast.success('Started a new conversation');
  };

  return {
    messages,
    isAiTyping,
    handleSendMessage,
    handleNewDialog
  };
}
