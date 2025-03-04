
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getCase, getCaseDocuments } from '@/utils/documents';
import { getChatMessages, saveChatMessages, addChatMessage, generateWelcomeMessage } from '@/utils/documents/chatManager';
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
  
  useEffect(() => {
    if (!caseId) {
      navigate('/case-management');
      return;
    }
    
    const loadCase = () => {
      try {
        const caseInfo = getCase(caseId);
        if (caseInfo) {
          setCaseData({
            ...caseInfo,
            caseNumber: `CASE-${caseInfo.id.substring(5, 10)}`
          });
          
          const docs = getCaseDocuments(caseId);
          setCaseDocuments(docs.map(doc => ({
            id: doc.id,
            name: doc.title,
            type: 'Document',
            date: new Date(doc.lastModified).toLocaleDateString()
          })));
          
          // Load existing chat messages or add welcome message
          const existingMessages = getChatMessages(caseId);
          if (existingMessages.length > 0) {
            setMessages(existingMessages);
          } else {
            // Add initial welcome message from AI
            const welcomeMessage = generateWelcomeMessage(caseInfo.name);
            setMessages([welcomeMessage]);
            saveChatMessages(caseId, [welcomeMessage]);
          }
        } else {
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
  
  const handleSendMessage = (currentMessage: string) => {
    if (!caseId) return;
    
    // Add user message
    const userMessage: ChatMessageProps = {
      id: `msg-${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatMessages(caseId, updatedMessages);
    
    // Simulate AI thinking
    setIsAiTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        `I'll analyze the case details for "${caseData?.name}" right away.`,
        `Looking at the documents for this case, I can provide some insights about ${caseData?.name}.`,
        `Based on the case priority and status, I recommend focusing on the following aspects...`,
        `I've analyzed similar cases and can provide precedents that may be helpful for ${caseData?.name}.`
      ];
      
      const aiResponse: ChatMessageProps = {
        id: `msg-${Date.now()}`,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: Date.now()
      };
      
      const messagesWithAiResponse = [...updatedMessages, aiResponse];
      setMessages(messagesWithAiResponse);
      saveChatMessages(caseId, messagesWithAiResponse);
      setIsAiTyping(false);
    }, 1500);
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
          />
        </div>
      </main>
    </div>
  );
};

export default CaseChat;
