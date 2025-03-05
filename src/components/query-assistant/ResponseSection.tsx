
import { motion } from 'framer-motion';
import QueryResponseDisplay from '@/components/QueryResponseDisplay';
import CitationBox from '@/components/citation/CitationBox';
import { Citation } from '@/services/citationService';

interface ResponseSectionProps {
  isProcessing: boolean;
  response: string | null;
  onShare: () => void;
  citations: Citation[];
}

const ResponseSection = ({ isProcessing, response, onShare, citations }: ResponseSectionProps) => {
  return (
    <>
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

export default ResponseSection;
