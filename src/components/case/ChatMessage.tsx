
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, File } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

export interface ChatFileAttachment {
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  files?: ChatFileAttachment[];
}

const ChatMessage = ({ content, sender, timestamp, files }: ChatMessageProps) => {
  const isAi = sender === 'ai';
  const time = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  return (
    <div className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isAi ? 'bg-primary/10' : 'bg-muted'}`}>
        {isAi ? <Bot className="h-5 w-5 text-primary" /> : <User className="h-5 w-5" />}
      </div>
      
      <div className={`flex flex-col max-w-[85%] ${isAi ? '' : 'items-end'}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`font-medium text-xs ${isAi ? 'text-primary' : 'text-muted-foreground'}`}>
              {isAi ? 'AI Assistant' : 'You'} • {time}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {new Date(timestamp).toLocaleString()}
          </TooltipContent>
        </Tooltip>
        
        <div className={`mt-1 rounded-xl p-3 ${
          isAi 
            ? 'bg-background border shadow-sm' 
            : 'bg-primary text-primary-foreground'
        }`}>
          {content && (
            <div className={`prose prose-sm max-w-none ${isAi ? 'prose-neutral' : 'prose-invert'}`}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
          
          {files && files.length > 0 && (
            <div className={`mt-2 pt-2 ${isAi ? 'border-t border-border' : 'border-t border-primary-foreground/20'}`}>
              <div className="font-medium text-xs mb-1.5">
                Attached Files:
              </div>
              <div className="space-y-1.5">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <File className="h-3.5 w-3.5" />
                    <span className="text-sm truncate">{file.name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                      {(file.size / 1024).toFixed(0)} KB
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
