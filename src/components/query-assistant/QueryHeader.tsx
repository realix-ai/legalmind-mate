
import { motion } from 'framer-motion';
import { useUserProfile } from '@/hooks/use-user-profile';

const QueryHeader = () => {
  const { userName } = useUserProfile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      <p className="text-lg text-muted-foreground mb-6">
        Ask legal questions and get AI-powered answers to assist with your cases
      </p>
    </motion.div>
  );
};

export default QueryHeader;
