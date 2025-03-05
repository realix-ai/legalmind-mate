
import React from 'react';
import DocumentsPanel from '@/components/case/DocumentsPanel';
import ChatPanel from '@/components/case/ChatPanel';
import { ChatMessageProps } from '@/components/case/ChatMessage';

interface CaseChatContainerProps {
  caseNumber?: string;
  caseName?: string;
  documents: any[];
  messages: ChatMessageProps[];
  isAiTyping: boolean;
  onSendMessage: (message: string, files?: File[]) => void;
  onNewDialog: () => void;
  showDocumentPanel: boolean;
  toggleDocumentPanel: () => void;
}

const CaseChatContainer: React.FC<CaseChatContainerProps> = ({
  caseNumber,
  caseName,
  documents,
  messages,
  isAiTyping,
  onSendMessage,
  onNewDialog,
  showDocumentPanel,
  toggleDocumentPanel
}) => {
  return (
    <div className={`grid grid-cols-1 ${showDocumentPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
      {/* Documents Panel - conditionally show based on showDocumentPanel state */}
      {showDocumentPanel && (
        <DocumentsPanel 
          caseNumber={caseNumber || ''}
          caseName={caseName || ''}
          documents={documents}
        />
      )}
      
      {/* AI Assistant Chat - make it span the full width when document panel is hidden */}
      <div className={showDocumentPanel ? 'lg:col-span-2' : 'lg:col-span-1'}>
        <ChatPanel 
          messages={messages}
          isAiTyping={isAiTyping}
          onSendMessage={onSendMessage}
          onNewDialog={onNewDialog}
          showDocumentPanel={showDocumentPanel}
          toggleDocumentPanel={toggleDocumentPanel}
        />
      </div>
    </div>
  );
};

export default CaseChatContainer;
