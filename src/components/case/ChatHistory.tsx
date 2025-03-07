
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ChatMessageProps } from './ChatMessage';
import { getSessionsList, getChatMessages } from '@/utils/documents/chat';
import { useParams } from 'react-router-dom';

interface ChatHistoryProps {
  messages: ChatMessageProps[];
  onSelectMessage: (messageText: string) => void;
}

type CaseChatParams = {
  caseId: string;
};

const ChatHistory = ({ messages, onSelectMessage }: ChatHistoryProps) => {
  const { caseId } = useParams<CaseChatParams>();
  const [sessions, setSessions] = useState<Array<{id: string, timestamp: number}>>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessageProps[]>([]);
  
  useEffect(() => {
    if (caseId) {
      // Load all available sessions for this case
      const loadSessions = async () => {
        const availableSessions = await getSessionsList(caseId);
        setSessions(availableSessions);
      };
      
      loadSessions();
    }
  }, [caseId, messages]);
  
  // Load messages for a specific session when clicked
  const handleSessionClick = async (sessionId: string) => {
    if (!caseId) return;
    
    setActiveSessionId(sessionId);
    const messagesForSession = await getChatMessages(caseId, sessionId);
    setSessionMessages(messagesForSession);
  };
  
  // Filter to only show user messages from the selected session
  const userMessages = activeSessionId 
    ? sessionMessages.filter(message => message.sender === 'user')
    : [];
  
  return (
    <div className="border rounded-lg bg-card shadow-md">
      <h3 className="text-sm font-medium p-3 border-b">Conversations</h3>
      
      {sessions.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground py-2 italic">No previous conversations</p>
          <p className="text-xs text-muted-foreground">Start a new conversation by typing a message below</p>
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <h4 className="text-xs font-medium text-muted-foreground">Select a conversation</h4>
            <ul className="space-y-1 mt-1">
              {sessions.map(session => (
                <li 
                  key={session.id}
                  className={`text-xs p-2 rounded-md cursor-pointer ${activeSessionId === session.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  onClick={() => handleSessionClick(session.id)}
                >
                  Conversation {format(new Date(session.timestamp), 'MMM d, h:mm a')}
                </li>
              ))}
            </ul>
          </div>
          
          {activeSessionId && (
            <div>
              <h4 className="text-xs font-medium p-2 border-b">Messages in this conversation</h4>
              {userMessages.length === 0 ? (
                <p className="p-3 text-xs text-muted-foreground italic">No user messages in this conversation</p>
              ) : (
                <ul>
                  {userMessages.map(message => (
                    <li 
                      key={message.id}
                      className="p-3 hover:bg-accent/30 border-b last:border-b-0 cursor-pointer transition-colors"
                      onClick={() => onSelectMessage(message.content)}
                    >
                      <div className="text-sm truncate">{message.content}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
