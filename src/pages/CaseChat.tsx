
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  MessageSquare, 
  FileText,
  MoreHorizontal,
  Send,
  User,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getCase, getCaseDocuments } from '@/utils/documents';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type CaseChatParams = {
  caseId: string;
};

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const CaseChat = () => {
  const { caseId } = useParams<CaseChatParams>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [caseData, setCaseData] = useState<any | null>(null);
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
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
          
          // Add initial welcome message from AI
          setMessages([
            {
              id: `msg-${Date.now()}`,
              content: `Welcome to case "${caseInfo.name}". How can I assist you with this case today?`,
              sender: 'ai',
              timestamp: Date.now()
            }
          ]);
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
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);
  
  const handleBack = () => {
    navigate('/case-management');
  };
  
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
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
      
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-card rounded-lg shadow-md p-6 max-h-[calc(100vh-160px)] overflow-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Documents</h2>
                <p className="text-muted-foreground text-sm">Case: {caseData?.caseNumber}</p>
              </div>
            </div>
            
            {caseDocuments.length > 0 ? (
              <ul className="space-y-3">
                {caseDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between p-3 rounded-md border hover:border-primary/50 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{doc.name}</h4>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate(`/document-drafting/edit/${doc.id}`)}
                      className="hover:bg-primary/5"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-3">
                  <FileText className="h-8 w-8 text-primary/70" />
                </div>
                <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a document and assign it to this case
                </p>
                <Button onClick={() => navigate('/document-drafting')}>
                  Create Document
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* AI Assistant Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="lg:col-span-2 bg-card rounded-lg shadow-md flex flex-col h-[calc(100vh-160px)]"
          >
            <div className="p-4 border-b flex items-center bg-primary/5 rounded-t-lg">
              <div className="bg-primary/10 rounded-full p-2 mr-2">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Case Assistant</h2>
                <p className="text-xs text-muted-foreground">AI-powered legal assistant</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={cn(
                      "max-w-[85%] rounded-xl p-3 shadow-sm", 
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 shrink-0">
                      <AvatarFallback className="bg-secondary text-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isAiTyping && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="max-w-[85%] rounded-xl p-3 bg-muted rounded-tl-none shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* This empty div is used for scrolling to the bottom */}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t bg-secondary/30">
              <form 
                className="flex gap-2 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input 
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask about this case..."
                  className="flex-1 bg-white dark:bg-card border shadow-sm focus-visible:ring-primary"
                />
                <Button 
                  type="submit"
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isAiTyping}
                  className="shrink-0"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CaseChat;
