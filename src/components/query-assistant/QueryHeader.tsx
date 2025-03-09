
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
      <div className="flex items-center justify-center gap-2 mb-4">
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Dynamic first W */}
          <path 
            d="M12 16C12 16 15 32 16 32C17 32 20 20 20 20C20 20 23 32 24 32C25 32 28 16 28 16" 
            stroke="#0EA5E9" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Dynamic second W */}
          <path 
            d="M20 16C20 16 23 32 24 32C25 32 28 20 28 20C28 20 31 32 32 32C33 32 36 16 36 16" 
            stroke="#0EA5E9" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>
        <h1 className="text-3xl font-bold">Works Wise Legal Assistant</h1>
      </div>
      
      <p className="text-lg text-muted-foreground mb-6">
        Ask legal questions and get AI-powered answers to assist with your cases
      </p>
    </motion.div>
  );
};

export default QueryHeader;
