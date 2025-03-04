
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { 
  Send, 
  ArrowLeft,
  FileText,
  Upload,
  Bot,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { getCase, getCaseDocuments } from '@/utils/documents';
import { processLegalQuery } from '@/services/legalQueryService';

const CaseChat = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any | null>(null);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  
  // Initialize with case data
  useEffect(() => {
    if (!caseId) {
      navigate('/case-management');
      return;
    }
    
    const currentCase = getCase(caseId);
    if (!currentCase) {
      toast.error('Case not found');
      navigate('/case-management');
      return;
    }
    
    setCaseData(currentCase);
    setCaseDocuments(getCaseDocuments(caseId));
    
    // Add welcome message
    setMessages([{
      sender: 'bot',
      text: `Welcome to ${currentCase.name} assistant. How can I help you with this case today?`
    }]);
  }, [caseId, navigate]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Process the query using the legal query service
      const response = await processLegalQuery(
        userMessage, 
        'legal-research',
        null
      );
      
      if (response.status === 'success') {
        setMessages(prev => [...prev, { sender: 'bot', text: response.content }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I apologize, but I encountered an error processing your request.' }]);
        toast.error('Error processing query');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'I apologize, but I encountered an error processing your request.' }]);
      toast.error('Error processing message');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!caseData) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container max-w-7xl mx-auto pt-24 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16 flex flex-col">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4 flex-1 flex flex-col">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-4"
            onClick={() => navigate('/case-management')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{caseData.name}</h1>
              <p className="text-muted-foreground">Case Assistant</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
          {/* Documents Sidebar */}
          <div className="md:col-span-1">
            <div className="border rounded-xl overflow-hidden h-full flex flex-col">
              <div className="bg-muted p-4 flex items-center justify-between">
                <h3 className="font-medium">Case Documents</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-2 flex-1 overflow-y-auto">
                {caseDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {caseDocuments.map((doc) => (
                      <div key={doc.id} className="p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                            <p className="text-xs text-muted-foreground">Document</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">No documents in this case yet</p>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Upload className="h-4 w-4" />
                        Add Document
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="md:col-span-3 flex flex-col h-full">
            <div className="border rounded-xl overflow-hidden flex-1 flex flex-col">
              <div className="bg-muted p-4">
                <h3 className="font-medium">Chat with Case Assistant</h3>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] px-4 py-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'bot' ? (
                            <Bot className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          <span className="text-xs font-medium">
                            {message.sender === 'user' ? 'You' : 'Case Assistant'}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about this case..."
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                    disabled={isProcessing}
                  />
                  <Button type="submit" disabled={isProcessing || !input.trim()}>
                    {isProcessing ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseChat;
