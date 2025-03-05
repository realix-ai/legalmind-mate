
import { motion } from 'framer-motion';
import QueryForm from '@/components/QueryForm';
import QueryResponseDisplay from '@/components/QueryResponseDisplay';
import CitationBox from '@/components/citation/CitationBox';
import { Citation } from '@/services/citationService';

interface QueryTabProps {
  isProcessing: boolean;
  response: string | null;
  onSubmit: (query: string, selectedOption: string, files: File[]) => Promise<void>;
  onShare: () => void;
  citations: Citation[];
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

const QueryTab = ({ isProcessing, response, onSubmit, onShare, citations }: QueryTabProps) => {
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-2xl md:text-3xl font-semibold mb-4 text-center"
        >
          Query Assistant
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-muted-foreground text-center mb-8"
        >
          Ask a legal question and select how you'd like the AI to process your query.
        </motion.p>
        
        <QueryForm 
          onSubmit={onSubmit}
          isProcessing={isProcessing}
        />
      </motion.div>
      
      <QueryResponseDisplay
        isProcessing={isProcessing}
        response={response}
        onShare={onShare}
        showShareButton={!!response && !isProcessing}
      />
      
      {!isProcessing && citations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <CitationBox citations={citations} />
        </motion.div>
      )}
    </>
  );
};

export default QueryTab;
