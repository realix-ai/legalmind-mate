
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BatchProcessingPanel from '@/components/batch/BatchProcessingPanel';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';
import ResearchToolsPanel from '@/components/research-tools/ResearchToolsPanel';
import QueryTab from './QueryTab';

interface QueryTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isProcessing: boolean;
  response: string | null;
  handleSubmit: (query: string, selectedOption: string, files: File[]) => Promise<void>;
  onShare: () => void;
  citations: any[];
  currentQuery: string;
}

const QueryTabs = ({
  activeTab,
  setActiveTab,
  isProcessing,
  response,
  handleSubmit,
  onShare,
  citations,
  currentQuery
}: QueryTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="mb-8">
      <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
        <TabsTrigger value="query">Single Query</TabsTrigger>
        <TabsTrigger value="batch">Batch Processing</TabsTrigger>
        <TabsTrigger value="research-tools">Research Tools</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="query">
        <QueryTab 
          isProcessing={isProcessing}
          response={response}
          onSubmit={handleSubmit}
          onShare={onShare}
          citations={citations}
        />
      </TabsContent>
      
      <TabsContent value="batch">
        <BatchProcessingPanel />
      </TabsContent>
      
      <TabsContent value="research-tools">
        <ResearchToolsPanel currentQuery={currentQuery} />
      </TabsContent>
      
      <TabsContent value="collaboration">
        <CollaborationPanel />
      </TabsContent>
    </Tabs>
  );
};

export default QueryTabs;
