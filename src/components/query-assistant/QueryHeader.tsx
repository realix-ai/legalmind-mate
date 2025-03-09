
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
          <rect width="48" height="48" rx="10" fill="#0EA5E9" fillOpacity="0.1"/>
          <path d="M14 12L24 8L34 12V20C34 28.2 30 32 24 36C18 32 14 28.2 14 20V12Z" fill="#0EA5E9" fillOpacity="0.8"/>
          <path d="M24 30L32 22L28 18L24 22L20 18L16 22L24 30Z" fill="white"/>
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
