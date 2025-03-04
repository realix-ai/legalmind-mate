
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getCase, getCaseDocuments } from '@/utils/documents';
import { 
  getChatMessages, 
  saveChatMessages, 
  addChatMessage, 
  generateWelcomeMessage,
  generateAIResponse,
  clearChatHistory,
  getSessionsList
} from '@/utils/documents/chatManager';
import Navigation from '@/components/Navigation';
import Loading from '@/components/case/Loading';
import DocumentsPanel from '@/components/case/DocumentsPanel';
import ChatPanel from '@/components/case/ChatPanel';
import { ChatMessageProps } from '@/components/case/ChatMessage';

type CaseChatParams = {
  caseId: string;
};

const CaseChat = () => {
  const { caseId } = useParams<CaseChatParams>();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState<any | null>(null);
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  // Track active conversation with a session ID
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`);
  
  useEffect(() => {
    if (!caseId) {
      navigate('/case-management');
      return;
    }
    
    const loadCase = () => {
      try {
        console.log("Loading case with ID:", caseId);
        const caseInfo = getCase(caseId);
        if (caseInfo) {
          console.log("Case found:", caseInfo);
          setCaseData({
            ...caseInfo,
            caseNumber: `CASE-${caseInfo.id.substring(5, 10)}`
          });
          
          const docs = getCaseDocuments(caseId);
          console.log(`Found ${docs.length} documents for case:`, caseId);
          
          setCaseDocuments(docs.map(doc => ({
            id: doc.id,
            name: doc.title,
            type: 'Document',
            date: new Date(doc.lastModified).toLocaleDateString()
          })));
          
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
              const welcomeMessage = generateWelcomeMessage(caseInfo.name);
              setMessages([welcomeMessage]);
              saveChatMessages(caseId, [welcomeMessage], mostRecentSession.id);
            }
          } else {
            // No sessions exist yet, create a new one with welcome message
            const newSessionId = `session-${Date.now()}`;
            setSessionId(newSessionId);
            
            // Add initial welcome message from AI
            const welcomeMessage = generateWelcomeMessage(caseInfo.name);
            setMessages([welcomeMessage]);
            saveChatMessages(caseId, [welcomeMessage], newSessionId);
          }
        } else {
          console.error("Case not found with ID:", caseId);
          toast.error('Case not found');
          navigate('/case-management');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading case:', error);
        toast.error('Failed to load case');
        navigate('/case-management');
      }
    };
    
    loadCase();
  }, [caseId, navigate]);
  
  const handleBack = () => {
    navigate('/case-management');
  };
  
  const handleSendMessage = async (currentMessage: string) => {
    if (!caseId || !caseData) return;
    
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
        caseData.name,
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
    if (!caseId || !caseData) return;
    
    // Create a new session ID
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    
    // Generate a new welcome message
    const welcomeMessage = generateWelcomeMessage(caseData.name);
    
    // Reset current messages
    setMessages([welcomeMessage]);
    
    // Save the welcome message to the new session
    saveChatMessages(caseId, [welcomeMessage], newSessionId);
    
    toast.success('Started a new conversation');
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Case: {caseData?.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents Panel */}
          <DocumentsPanel 
            caseNumber={caseData?.caseNumber}
            caseName={caseData?.name}
            documents={caseDocuments}
          />
          
          {/* AI Assistant Chat */}
          <ChatPanel 
            messages={messages}
            isAiTyping={isAiTyping}
            onSendMessage={handleSendMessage}
            onNewDialog={handleNewDialog}
          />
        </div>
      </main>
    </div>
  );
};

export default CaseChat;
