
import React, { useState, useRef, useEffect } from 'react';
import { useAiAssistant } from '@/contexts/AiAssistantContext';
import { Bot, Send, PaperclipIcon, History, PlusCircle, List, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useFileUpload } from '@/hooks/ai/useFileUpload';
import { toast } from 'sonner';
import { generateCompletion } from '@/services/openAiService';
import PromptManager from '@/components/PromptManager';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import GetFromIManageDialog from '@/components/document/GetFromIManageDialog';
import { SavedDocument } from '@/utils/documents/types';
import {
  ChatMessage,
  ChatSession,
  getCurrentOrCreateSession,
  addMessageToSession,
  createChatSession,
  getChatSessions,
  setCurrentSession,
  getConversationContext,
  searchRelevantConversations
} from '@/utils/ai-chat/chatMemoryUtils';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const AiCommunicationPanel = () => {
  const [activeSession, setActiveSession] = useState<ChatSession>(() => getCurrentOrCreateSession());
  const [messages, setMessages] = useState<ChatMessage[]>(() => activeSession.messages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showIManageDialog, setShowIManageDialog] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addResponse } = useAiAssistant();
  
  const {
    uploadedFiles,
    setUploadedFiles,
    fileInputRef,
    handleFileUpload,
    handleFileChange,
    handleRemoveFile
  } = useFileUpload();

  useEffect(() => {
    const allSessions = getChatSessions();
    setSessions(allSessions);
  }, []);

  // Update session state when active session changes
  useEffect(() => {
    setMessages(activeSession.messages);
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() && uploadedFiles.length === 0) return;
    
    // Bug fix: Create a copy of uploadedFiles to prevent reference issues
    const filesCopy = [...uploadedFiles];
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date(),
      files: filesCopy.length > 0 ? filesCopy : undefined
    };
    
    // Add to local state immediately for UI responsiveness
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);
    
    // Add to persistent storage
    addMessageToSession(activeSession.id, userMessage);
    
    const conversationContext = getConversationContext(messages);
    let prompt = currentMessage;
    
    if (filesCopy.length > 0) {
      prompt += `\n\n[User has uploaded ${filesCopy.length} file(s): ${filesCopy.map(f => f.name).join(', ')}]`;
    }
    
    if (conversationContext) {
      prompt = `Previous conversation:\n${conversationContext}\n\nCurrent query: ${prompt}`;
    }
    
    const apiKey = localStorage.getItem('openai-api-key');
    let aiResponseContent = '';
    
    try {
      if (apiKey) {
        const systemPrompt = `You are an expert legal AI assistant for lawyers. Help with:
          1. Legal Research: Find relevant cases, statutes, and regulations
          2. Risk Analysis: Identify potential legal risks in scenarios
          3. Document Drafting: Suggest language for legal documents
          4. Summarization: Condense legal documents and case law
          5. Data Analysis: Extract insights from legal data
          
          Answer thoroughly with citations where appropriate. Use clear, organized responses with headings for complex questions.
          When analyzing documents, extract key information and provide actionable insights.
          
          You should try to maintain memory of the conversation so far and refer back to previous information if relevant.`;
        
        const response = await generateCompletion(prompt, systemPrompt, 'gpt-4o-mini');
        aiResponseContent = response || "I'm having trouble generating a response. Please try again later.";
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        aiResponseContent = generateSimulatedResponse(currentMessage, filesCopy);
      }
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      addMessageToSession(activeSession.id, aiMessage);
      
      addResponse(aiResponseContent);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate response');
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "I'm sorry, there was an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      addMessageToSession(activeSession.id, errorMessage);
    } finally {
      setIsProcessing(false);
      setUploadedFiles([]);
    }
  };

  const handleNewDialog = () => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      content: "Hello! I'm your legal AI assistant. I can help with legal research, risk analysis, document drafting, summarization, data analysis, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    };
    
    const newSession = createChatSession(welcomeMessage);
    setCurrentSession(newSession.id);
    setActiveSession(newSession);
    setMessages(newSession.messages);
    setSessions(getChatSessions());
    toast.success('Started new conversation');
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session.id);
    setActiveSession(session);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleSelectHistoryMessage = (message: ChatMessage) => {
    if (message.isUser) {
      setCurrentMessage(message.content);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setCurrentMessage(promptText);
    setShowPrompts(false);
  };

  const handleIManageDocument = (document: SavedDocument) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: `I've selected a document from iManage: "${document.title}"`,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    addMessageToSession(activeSession.id, userMessage);
    
    setCurrentMessage(`Please analyze this document from iManage: "${document.title}"`);
    
    const documentContentMessage: ChatMessage = {
      id: uuidv4(),
      content: `[Document content from iManage: ${document.content.substring(0, 100)}...]`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, documentContentMessage]);
    addMessageToSession(activeSession.id, documentContentMessage);
    
    setShowIManageDialog(false);
  };

  const generateSimulatedResponse = (message: string, files: File[]): string => {
    const lowerMessage = message.toLowerCase();
    
    const relevantSessions = searchRelevantConversations(message);
    let memoryContext = '';
    
    if (relevantSessions.length > 0) {
      memoryContext = `\n\n**Based on our previous conversations about similar topics, I recall that:**\n`;
      relevantSessions.slice(0, 2).forEach(session => {
        const aiMessage = session.messages.find(m => !m.isUser && m.content.length > 50);
        if (aiMessage) {
          const excerpt = aiMessage.content.substring(0, 150) + '...';
          memoryContext += `- ${excerpt}\n`;
        }
      });
    }
    
    if (files.length > 0) {
      return `I've received your message along with ${files.length} file(s). As a legal AI assistant, I would typically:

1. Extract the text content from these documents
2. Analyze the legal language and identify key clauses, terms, and potential issues
3. Provide you with a detailed analysis in the context of your query

For demonstration purposes, I can tell you that I would examine these files for relevant legal information and incorporate it into my analysis of your question about "${message.substring(0, 30)}..."${memoryContext}`;
    }
    
    if (lowerMessage.includes('research') || lowerMessage.includes('case law') || lowerMessage.includes('precedent') || lowerMessage.includes('statute')) {
      return `## Legal Research Response

Based on your query about "${message.substring(0, 30)}...", I would typically provide:

1. **Relevant Case Law**: Key precedents from state and federal courts
2. **Statutory References**: Applicable statutes and regulations
3. **Legal Doctrines**: Controlling legal principles
4. **Jurisdiction-Specific Guidance**: How this varies across jurisdictions

To provide more specific research, please connect your OpenAI API key in settings or provide more details about your legal question.${memoryContext}`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('liability') || lowerMessage.includes('compliance') || lowerMessage.includes('violation')) {
      return `## Risk Analysis

Regarding your query about "${message.substring(0, 30)}...", I would typically provide a comprehensive risk assessment including:

**HIGH RISK FACTORS**:
- Key regulatory compliance issues
- Potential liability exposure areas
- Statutory violation concerns

**MEDIUM RISK FACTORS**:
- Procedural considerations
- Documentation requirements

**LOW RISK FACTORS**:
- Standard industry practices
- Administrative considerations

For a detailed risk analysis with mitigation strategies, please connect your OpenAI API key in settings.${memoryContext}`;
    }
    
    if (lowerMessage.includes('draft') || lowerMessage.includes('contract') || lowerMessage.includes('agreement') || lowerMessage.includes('clause')) {
      return `## Document Drafting Assistance

For your request about "${message.substring(0, 30)}...", I would typically help by:

1. **Suggested Language**: Providing recommended clause text
2. **Structure Guidance**: Advising on document organization
3. **Term Definitions**: Suggesting clear definitions for key terms
4. **Alternative Phrasings**: Offering variations for different legal positions

To get specific drafting assistance tailored to your jurisdiction and needs, please connect your OpenAI API key in settings.${memoryContext}`;
    }
    
    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary') || lowerMessage.includes('brief') || lowerMessage.includes('overview')) {
      return `## Document Summary

If I were to summarize material related to "${message.substring(0, 30)}...", I would structure it as:

**KEY FACTS**:
- Primary parties and relationships
- Timeline of critical events
- Disputed issues or claims

**LEGAL FRAMEWORK**:
- Applicable legal doctrines
- Relevant statutory authority
- Controlling precedent

**CRITICAL ANALYSIS**:
- Strengths and weaknesses
- Potential outcomes and implications

For a comprehensive summary tailored to your specific documents, please connect your OpenAI API key in settings.${memoryContext}`;
    }
    
    if (lowerMessage.includes('data') || lowerMessage.includes('analytics') || lowerMessage.includes('trends') || lowerMessage.includes('statistics')) {
      return `## Legal Data Analysis

Regarding your query about "${message.substring(0, 30)}...", I would typically provide:

**STATISTICAL INSIGHTS**:
- Case outcome probabilities
- Settlement value ranges
- Timelines for similar proceedings

**TREND ANALYSIS**:
- Recent shifts in legal interpretations
- Emerging patterns in judgments
- Changes in regulatory enforcement

**JURISDICTIONAL COMPARISON**:
- Variations across courts and regions
- Forum selection considerations

For detailed legal data analysis with visualizations and projections, please connect your OpenAI API key in settings.${memoryContext}`;
    }
    
    if (lowerMessage.includes('imanage') || lowerMessage.includes('document')) {
      return `## Document Management

I see you're interested in documents or iManage. As your legal AI assistant, I can:

1. **Extract Key Information**: Identify critical clauses, parties, dates, and terms
2. **Analyze Documents**: Review for compliance, risks, and opportunities
3. **Compare Documents**: Highlight differences between versions or similar documents
4. **Summarize Content**: Create concise summaries of lengthy legal documents

You can select documents from iManage using the iManage button in the toolbar for me to analyze directly.${memoryContext}`;
    }
    
    return `As your legal AI assistant, I can help with a wide range of tasks including:

1. **Legal Research**: Finding relevant cases, statutes, and legal principles
2. **Risk Analysis**: Evaluating scenarios for potential legal exposure
3. **Document Drafting**: Assisting with contract language, pleadings, and legal communications
4. **Summarization**: Condensing lengthy legal materials into concise briefs
5. **Data Analysis**: Extracting insights from legal data sets

For the most helpful response to your query about "${message.substring(0, 30)}...", please:
- Provide specific details about your legal question
- Mention relevant jurisdiction, practice area, or legal context
- Connect your OpenAI API key in settings for enhanced capabilities

Remember, you can also upload documents using the paperclip icon or access iManage documents for direct analysis.${memoryContext}`;
  };

  const formatTimestamp = (timestamp: Date | string | number) => {
    if (timestamp instanceof Date) {
      return format(timestamp, 'h:mm a');
    } else if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'h:mm a');
    } else if (typeof timestamp === 'number') {
      return format(new Date(timestamp), 'h:mm a');
    }
    return 'Unknown time';
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[70vh] gap-4">
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-background">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border'
              }`}
              onClick={() => handleSelectHistoryMessage(message)}
            >
              {!message.isUser && (
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="text-xs font-medium">AI Assistant</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs mt-1 opacity-70 text-right">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start mb-4">
            <Card className="max-w-[80%] p-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="border rounded-lg p-2 bg-muted/30">
          <p className="text-sm font-medium mb-2">Uploaded files:</p>
          <div className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center text-sm p-1.5 bg-background rounded border">
                <span className="truncate max-w-[80%]">{file.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveFile(index)}
                  className="h-6 text-xs text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2 mb-2">
        <Popover open={showHistory} onOpenChange={setShowHistory}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 z-10 text-xs py-1 px-2 h-7"
            >
              <History className="h-3 w-3" />
              History
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <h3 className="text-sm font-medium">Chat History</h3>
              <p className="text-xs text-muted-foreground">Select a conversation or message</p>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {sessions.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No conversation history yet</p>
              ) : (
                <div className="space-y-2">
                  {sessions.map(session => (
                    <div 
                      key={session.id}
                      className={`text-xs p-2 hover:bg-accent rounded cursor-pointer ${session.id === activeSession.id ? 'bg-accent/50' : ''}`}
                      onClick={() => handleSelectSession(session)}
                    >
                      <div className="font-medium">{session.name}</div>
                      <div className="truncate opacity-70 mt-1">
                        {session.messages[session.messages.length - 1]?.content.substring(0, 50)}...
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {new Date(session.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 z-10 text-xs py-1 px-2 h-7"
          onClick={handleNewDialog}
        >
          <PlusCircle className="h-3 w-3" />
          New Dialog
        </Button>
        
        <Popover open={showPrompts} onOpenChange={setShowPrompts}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 z-10 text-xs py-1 px-2 h-7"
            >
              <List className="h-3 w-3" />
              Load Prompts
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <PromptManager onSelectPrompt={handleSelectPrompt} />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 z-10 text-xs py-1 px-2 h-7"
          onClick={() => setShowIManageDialog(true)}
        >
          <Cloud className="h-3 w-3" />
          iManage
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10"
          onClick={handleFileUpload}
        >
          <PaperclipIcon className="h-4 w-4" />
          <input 
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
          />
        </Button>
        
        <Textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 min-h-[40px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        
        <Button 
          className="h-10 w-10"
          size="icon"
          onClick={handleSendMessage}
          disabled={isProcessing || (!currentMessage.trim() && uploadedFiles.length === 0)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <GetFromIManageDialog
        onDocumentSelected={handleIManageDocument}
        open={showIManageDialog}
        onOpenChange={setShowIManageDialog}
      />
    </div>
  );
};

export default AiCommunicationPanel;
