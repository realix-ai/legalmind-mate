
import { motion } from 'framer-motion';
import { FileText, Users, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { Citation } from '@/services/citationService';
import { ResearchToolType } from '@/services/legalResearchToolsService';
import QueryTab from '@/components/query-assistant/QueryTab';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';
import ResearchToolsPanel from '@/components/legal-research/ResearchToolsPanel';

interface QueryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isProcessing: boolean;
  response: string | null;
  currentQuery: string;
  handleSubmit: (query: string, selectedOption: string, files: File[], researchTool?: ResearchToolType) => Promise<void>;
  onShare: () => void;
  citations: Citation[];
  onResponseEdit?: (editedResponse: string) => void;
}

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const QueryTabs = ({
  activeTab,
  setActiveTab,
  isProcessing,
  response,
  currentQuery,
  handleSubmit,
  onShare,
  citations,
  onResponseEdit
}: QueryTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="query" className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Query</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Collaboration</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>Research Tools</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center">
          <NotificationDropdown />
        </div>
      </div>
      
      <TabsContent value="query" className="mt-0">
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
        >
          <QueryTab
            isProcessing={isProcessing}
            response={response}
            currentQuery={currentQuery}
            onSubmit={handleSubmit}
            onShare={onShare}
            citations={citations}
            onResponseEdit={onResponseEdit}
          />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="collaboration" className="mt-0">
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
        >
          <CollaborationPanel />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="tools" className="mt-0">
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
        >
          <ResearchToolsPanel />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default QueryTabs;
