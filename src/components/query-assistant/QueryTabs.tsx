
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BatchProcessingPanel from '@/components/batch/BatchProcessingPanel';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';
import AiCommunicationPanel from '@/components/ai-communication/AiCommunicationPanel';
import QueryTab from './QueryTab';
import { ResearchToolType } from '@/services/legalResearchToolsService';

interface QueryTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isProcessing: boolean;
  response: string | null;
  handleSubmit: (query: string, selectedOption: string, files: File[], researchTool?: ResearchToolType) => Promise<void>;
  onShare: () => void;
  citations: any[];
  currentQuery: string;
  onResponseEdit?: (editedResponse: string) => void;
}

const QueryTabs = ({
  activeTab,
  setActiveTab,
  isProcessing,
  response,
  handleSubmit,
  onShare,
  citations,
  currentQuery,
  onResponseEdit
}: QueryTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="mb-8">
      <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
        <TabsTrigger value="query">Single Query</TabsTrigger>
        <TabsTrigger value="batch">Batch Processing</TabsTrigger>
        <TabsTrigger value="ai-communication">AI Chatbot</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="query">
        <QueryTab 
          isProcessing={isProcessing}
          response={response}
          currentQuery={currentQuery}
          onSubmit={handleSubmit}
          onShare={onShare}
          citations={citations}
          onResponseEdit={onResponseEdit}
        />
      </TabsContent>
      
      <TabsContent value="batch">
        <BatchProcessingPanel />
      </TabsContent>
      
      <TabsContent value="ai-communication">
        <AiCommunicationPanel />
      </TabsContent>
      
      <TabsContent value="collaboration">
        <CollaborationPanel />
      </TabsContent>
    </Tabs>
  );
};

export default QueryTabs;
