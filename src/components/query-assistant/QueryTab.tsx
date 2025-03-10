
import { motion } from 'framer-motion';
import QueryForm from '@/components/QueryForm';
import { ResearchToolType } from '@/services/legalResearchToolsService';
import { Citation } from '@/services/citationService';
import QueryHeader from './QueryHeader';
import ResponseSection from './ResponseSection';

interface QueryTabProps {
  isProcessing: boolean;
  response: string | null;
  currentQuery: string;
  onSubmit: (query: string, selectedOption: string, files: File[], researchTool?: ResearchToolType) => Promise<void>;
  onShare: () => void;
  onEmail?: () => void;
  citations: Citation[];
  onResponseEdit?: (editedResponse: string) => void;
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

const QueryTab = ({ 
  isProcessing, 
  response, 
  currentQuery,
  onSubmit, 
  onShare,
  onEmail,
  citations,
  onResponseEdit 
}: QueryTabProps) => {
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <QueryHeader />
        
        <motion.div variants={itemVariants}>
          <QueryForm 
            onSubmit={onSubmit}
            isProcessing={isProcessing}
          />
        </motion.div>
      </motion.div>
      
      <ResponseSection 
        isProcessing={isProcessing}
        response={response}
        onShare={onShare}
        onEmail={onEmail}
        citations={citations}
        onResponseEdit={onResponseEdit}
        query={currentQuery}
      />
    </>
  );
};

export default QueryTab;
