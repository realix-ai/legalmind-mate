
import React, { useState, useRef, useEffect } from 'react';
import { Send, List, History, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ChatHistory from '@/components/case/ChatHistory';
import { ChatMessageProps } from '@/components/case/ChatMessage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PromptManager from '@/components/PromptManager';
import FilesUploadButton from '@/components/case-chat/FilesUploadButton';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isDisabled: boolean;
  messages: ChatMessageProps[];
  onNewDialog: () => void;
}

const ChatInput = ({ onSendMessage, isDisabled, messages, onNewDialog }: ChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleSendMessage = () => {
    if (!currentMessage.trim() && uploadedFiles.length === 0) return;
    
    // Send message with any uploaded files
    onSendMessage(currentMessage, uploadedFiles);
    setCurrentMessage('');
    setUploadedFiles([]);
  };
  
  const handleSelectHistoryMessage = (messageText: string) => {
    setCurrentMessage(messageText);
  };
  
  const handleSelectPrompt = (promptText: string) => {
    setCurrentMessage(promptText);
    setShowPrompts(false);
  };
  
  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Auto-resize textarea based on content
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
    // Reset height first to get accurate scrollHeight
    e.target.style.height = 'auto';
    // Set new height based on content
    const newHeight = Math.min(e.target.scrollHeight, 120); // Max height of 120px
    e.target.style.height = `${newHeight}px`;
  };

  return (
    <div className="p-4 border-t bg-gradient-to-b from-background to-accent/10 rounded-b-xl">
      <div className="flex gap-2 mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 z-10 text-xs py-1 px-2 h-7"
              data-history-button="true"
            >
              <History className="h-3 w-3" />
              History
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <ChatHistory 
              messages={messages}
              onSelectMessage={handleSelectHistoryMessage}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 z-10 text-xs py-1 px-2 h-7"
          onClick={onNewDialog}
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
              data-prompt-button="true"
            >
              <List className="h-3 w-3" />
              Load Prompts
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <PromptManager onSelectPrompt={handleSelectPrompt} />
          </PopoverContent>
        </Popover>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mb-3 p-2 bg-muted rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-sm font-medium">
              Uploaded Files ({uploadedFiles.length})
            </div>
            <button
              type="button"
              className="text-xs text-destructive hover:underline"
              onClick={() => setUploadedFiles([])}
            >
              Remove All
            </button>
          </div>
          <div className="space-y-1.5">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center text-xs p-1.5 bg-background rounded">
                <span className="truncate max-w-[240px]">{file.name}</span>
                <button
                  type="button"
                  className="text-xs text-destructive hover:underline"
                  onClick={() => {
                    const newFiles = [...uploadedFiles];
                    newFiles.splice(index, 1);
                    setUploadedFiles(newFiles);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-3 items-end">
        <Textarea 
          value={currentMessage}
          onChange={handleTextareaChange}
          placeholder={uploadedFiles.length > 0 ? "Add a message about your files..." : "Type a new message or select from history..."}
          className="flex-1 min-h-[48px] max-h-[120px] bg-background border shadow-sm focus-visible:ring-primary resize-none overflow-y-auto py-3 px-4 rounded-xl"
          disabled={isDisabled}
          style={{ height: '48px' }} // Initial height
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        
        <FilesUploadButton 
          onFilesUploaded={handleFilesUploaded}
          isDisabled={isDisabled}
        />
        
        <Button 
          type="submit"
          onClick={handleSendMessage}
          disabled={(!currentMessage.trim() && uploadedFiles.length === 0) || isDisabled}
          className="h-12 w-12 rounded-full shadow-sm"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
