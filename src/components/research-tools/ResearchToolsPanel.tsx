
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { 
  ResearchToolType, 
  researchTools, 
  searchExternalTool 
} from '@/services/legalResearchToolsService';
import LegalResearchToolItem from './LegalResearchToolItem';
import ConfigureToolDialog from './ConfigureToolDialog';

interface ResearchToolsPanelProps {
  currentQuery: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const ResearchToolsPanel = ({ currentQuery }: ResearchToolsPanelProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [configToolId, setConfigToolId] = useState<ResearchToolType | null>(null);
  const [tools, setTools] = useState(researchTools);

  const handleSearch = (toolId: string) => {
    if (!currentQuery.trim()) {
      toast.error('Please enter a query first');
      return;
    }
    
    setIsSearching(true);
    toast.loading(`Searching in ${toolId}...`);
    
    // In a real app, this might trigger tracking or logging
    console.log(`Searching "${currentQuery}" in ${toolId}`);
    
    try {
      searchExternalTool(currentQuery, toolId as ResearchToolType);
      toast.dismiss();
      toast.success(`Opened ${toolId} in a new tab`);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Failed to open search');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfigureSuccess = () => {
    // Update the tools state to reflect the new configuration
    setTools(tools.map(tool => 
      tool.id === configToolId ? { ...tool, isConfigured: true } : tool
    ));
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-center">Legal Research Tools</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            Extend your research by searching your query in professional legal research databases.
          </p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="grid sm:grid-cols-2 gap-4 mb-6"
        >
          {tools.map(tool => (
            <LegalResearchToolItem
              key={tool.id}
              tool={tool}
              onSearch={handleSearch}
              onConfigure={(id) => setConfigToolId(id as ResearchToolType)}
              isSearching={isSearching}
            />
          ))}
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Don't see your preferred tool? 
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-1">
              Request integration <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </motion.div>
      </motion.div>
      
      <ConfigureToolDialog
        toolId={configToolId}
        toolName={tools.find(t => t.id === configToolId)?.name || ''}
        isOpen={!!configToolId}
        onClose={() => setConfigToolId(null)}
        onSuccess={handleConfigureSuccess}
      />
    </>
  );
};

export default ResearchToolsPanel;
