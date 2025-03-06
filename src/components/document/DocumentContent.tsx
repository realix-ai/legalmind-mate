
import React from 'react';
import { Input } from '@/components/ui/input';
import DocumentEditor from '@/components/document/DocumentEditor';
import DocumentCategories from '@/components/document/DocumentCategories';
import AiPromptInput from '@/components/document/AiPromptInput';

interface DocumentContentProps {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  documentContent: string;
  setDocumentContent: (content: string) => void;
  documentCategory: string;
  onCategoryChange: (category: string) => void;
  showAiPrompt: boolean;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isAiProcessing: boolean;
  onAiPromptSubmit: () => void;
}

const DocumentContent = ({
  documentTitle,
  setDocumentTitle,
  documentContent,
  setDocumentContent,
  documentCategory,
  onCategoryChange,
  showAiPrompt,
  aiPrompt,
  setAiPrompt,
  isAiProcessing,
  onAiPromptSubmit
}: DocumentContentProps) => {
  // Access the document ID from the URL or state if available
  // If you don't have direct access to documentId here, you can
  // get it from useParams or similar methods
  const documentId = localStorage.getItem('current_editing_document_id');
  
  return (
    <div className="space-y-4">
      <Input
        value={documentTitle}
        onChange={(e) => setDocumentTitle(e.target.value)}
        placeholder="Document Title"
        className="text-lg font-semibold border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto bg-transparent"
      />
      
      <DocumentCategories
        selectedCategory={documentCategory}
        onCategoryChange={onCategoryChange}
      />
      
      {showAiPrompt && (
        <AiPromptInput
          prompt={aiPrompt}
          setPrompt={setAiPrompt}
          isProcessing={isAiProcessing}
          onSubmit={onAiPromptSubmit}
        />
      )}
      
      <DocumentEditor
        documentContent={documentContent}
        setDocumentContent={setDocumentContent}
        documentId={documentId}
      />
    </div>
  );
};

export default DocumentContent;
