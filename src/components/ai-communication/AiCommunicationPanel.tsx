
import React, { useState, useRef } from 'react';
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

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AiCommunicationPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your AI assistant. How can I help you today with your legal queries or research?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { addResponse } = useAiAssistant();
  
  const {
    uploadedFiles,
    setUploadedFiles,
    fileInputRef,
    handleFileUpload,
    handleFileChange,
    handleRemoveFile
  } = useFileUpload();

  const handleSendMessage = async () => {
    if (!currentMessage.trim() && uploadedFiles.length === 0) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);
    
    try {
      // Create prompt with file information if files are uploaded
      let prompt = currentMessage;
      if (uploadedFiles.length > 0) {
        prompt += `\n\n[User has uploaded ${uploadedFiles.length} file(s): ${uploadedFiles.map(f => f.name).join(', ')}]`;
      }
      
      // Check if OpenAI API is configured
      const apiKey = localStorage.getItem('openai-api-key');
      let aiResponseContent = '';
      
      if (apiKey) {
        // Use OpenAI to generate response
        const systemPrompt = `You are an expert legal AI assistant. Provide helpful, accurate, and clear responses to legal questions. 
          Be concise yet informative, focusing on relevant legal principles, cases, and practical advice.`;
        
        const response = await generateCompletion(prompt, systemPrompt, 'gpt-4o-mini');
        aiResponseContent = response || "I'm having trouble generating a response. Please try again later.";
      } else {
        // Provide a simulated response
        await new Promise(resolve => setTimeout(resolve, 1000));
        aiResponseContent = generateSimulatedResponse(currentMessage, uploadedFiles);
      }
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      addResponse(aiResponseContent);
      
      // Clear uploaded files after processing
      setUploadedFiles([]);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewDialog = () => {
    // Clear chat history except for the welcome message
    setMessages([{
      id: 'welcome',
      content: "Hello! I'm your AI assistant. How can I help you today with your legal queries or research?",
      isUser: false,
      timestamp: new Date()
    }]);
    toast.success('Started new conversation');
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

  const handleIManageClick = () => {
    toast.info('iManage integration', { 
      description: 'iManage document management feature would be integrated here.',
      duration: 3000
    });
  };

  // Generate a simple response for demonstration when no API key is available
  const generateSimulatedResponse = (message: string, files: File[]): string => {
    const lowerMessage = message.toLowerCase();
    
    if (files.length > 0) {
      return `I've received your message along with ${files.length} file(s). In a real implementation, I would analyze these files and provide insights based on their content. For demonstration purposes, I can tell you that I would examine these documents for relevant legal information and incorporate it into my response.`;
    }
    
    if (lowerMessage.includes('legal') || lowerMessage.includes('law') || lowerMessage.includes('case')) {
      return "Based on your query about legal matters, I would typically provide information on relevant cases, statutes, and legal principles. To get the most accurate legal information, please connect your OpenAI API key in the settings or provide specific details about your legal question.";
    }
    
    if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
      return "Regarding your question about contracts or agreements, I would typically analyze contract terms, legal obligations, and potential risks. To get detailed assistance with contract analysis, please connect your OpenAI API key in the settings.";
    }
    
    return "I understand you're seeking information. For the most accurate and helpful responses to your legal queries, please connect your OpenAI API key in the settings or provide more specific details about your question.";
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
                {message.timestamp.toLocaleTimeString()}
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
      </div>
      
      {/* File upload section */}
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
      
      {/* Toolbar section */}
      <div className="flex gap-2 mb-2">
        <Popover>
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
              <p className="text-xs text-muted-foreground">Click on any message to reuse it</p>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {messages.filter(m => m.isUser).length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No message history yet</p>
              ) : (
                messages.filter(m => m.isUser).map(message => (
                  <div 
                    key={message.id}
                    className="text-xs p-2 hover:bg-accent rounded cursor-pointer"
                    onClick={() => setCurrentMessage(message.content)}
                  >
                    <div className="truncate">{message.content}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))
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
          onClick={handleIManageClick}
        >
          <Cloud className="h-3 w-3" />
          iManage
        </Button>
      </div>
      
      {/* Message input */}
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
    </div>
  );
};

export default AiCommunicationPanel;
