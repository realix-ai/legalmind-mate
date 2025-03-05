
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  
  // State for document panel visibility
  const [showDocumentPanel, setShowDocumentPanel] = useState<boolean>(true);
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <CaseChatHeader caseName={caseData?.name} />
        
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
