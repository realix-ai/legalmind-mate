
import { Sparkles } from 'lucide-react';
import DocumentEditor from '@/components/document/DocumentEditor';
import AiPromptInput from '@/components/document/AiPromptInput';

interface DocumentContentProps {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  documentContent: string;
  setDocumentContent: (content: string) => void;
  showAiPrompt: boolean;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isAiProcessing: boolean;
  onAiPromptSubmit: (prompt: string) => void;
}

const DocumentContent = ({
  documentTitle,
  setDocumentTitle,
  documentContent,
  setDocumentContent,
  showAiPrompt,
  aiPrompt,
  setAiPrompt,
  isAiProcessing,
  onAiPromptSubmit
}: DocumentContentProps) => {
  return (
    <div className="space-y-6">
      <input
        type="text"
        value={documentTitle}
        onChange={(e) => setDocumentTitle(e.target.value)}
        placeholder="Document Title"
        className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-primary/50 transition-all duration-200"
      />
      
      {/* AI Prompt section above the editor */}
      {showAiPrompt && (
        <div className="p-4 border rounded-md bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <AiPromptInput 
            aiPrompt={aiPrompt}
            setAiPrompt={setAiPrompt}
            isAiProcessing={isAiProcessing}
            onSubmit={onAiPromptSubmit}
          />
        </div>
      )}
      
      <DocumentEditor
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        documentContent={documentContent}
        setDocumentContent={setDocumentContent}
      />
    </div>
  );
};

export default DocumentContent;
