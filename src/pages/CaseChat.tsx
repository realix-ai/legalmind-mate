
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Loading from '@/components/case/Loading';
import CaseChatHeader from '@/components/case-chat/CaseChatHeader';
import CaseChatContainer from '@/components/case-chat/CaseChatContainer';
import { useCaseData } from '@/hooks/case-chat/useCaseData';
import { useChatMessages } from '@/hooks/case-chat/useChatMessages';

type CaseChatParams = {
  caseId: string;
};

const CaseChat = () => {
  const { caseId } = useParams<CaseChatParams>();
  const { caseData, caseDocuments, loading } = useCaseData(caseId);
  const { messages, isAiTyping, handleSendMessage, handleNewDialog } = useChatMessages(caseId, caseData?.name);
  
  // State for document panel visibility and OpenAI status
  const [showDocumentPanel, setShowDocumentPanel] = useState<boolean>(true);
  const [isUsingOpenAI, setIsUsingOpenAI] = useState(false);
  
  useEffect(() => {
    // Check if OpenAI API is configured
    setIsUsingOpenAI(Boolean(localStorage.getItem('openai-api-key')));
  }, []);
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <div className="flex items-center justify-between mb-6">
          <CaseChatHeader caseName={caseData?.name} />
          
          {isUsingOpenAI && (
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              ChatGPT Enabled
            </Badge>
          )}
        </div>
        
        <CaseChatContainer
          caseNumber={caseData?.caseNumber}
          caseName={caseData?.name}
          documents={caseDocuments}
          messages={messages}
          isAiTyping={isAiTyping}
          onSendMessage={handleSendMessage}
          onNewDialog={handleNewDialog}
          showDocumentPanel={showDocumentPanel}
          toggleDocumentPanel={() => setShowDocumentPanel(!showDocumentPanel)}
        />
      </main>
    </div>
  );
};

export default CaseChat;
