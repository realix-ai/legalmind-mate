
import { motion } from 'framer-motion';
import { useUserProfile } from '@/hooks/use-user-profile';

const QueryHeader = () => {
  const { userName } = useUserProfile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Legal Query Assistant</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Ask legal questions and get AI-powered answers to assist with your cases
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryHeader;
