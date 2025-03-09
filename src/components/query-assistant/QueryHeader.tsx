
import { motion } from 'framer-motion';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Search, AlertTriangle, FileText } from 'lucide-react';

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
          <rect width="48" height="48" rx="12" fill="#0EA5E9" fillOpacity="0.1"/>
          <path d="M12 14C12 12.8954 12.8954 12 14 12H34C35.1046 12 36 12.8954 36 14V34C36 35.1046 35.1046 36 34 36H14C12.8954 36 12 35.1046 12 34V14Z" fill="#0EA5E9" fillOpacity="0.08"/>
          
          {/* First W */}
          <path 
            d="M14 16L18 32L22 20L26 32L30 16" 
            stroke="#0EA5E9" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Second W - stylized and overlapping */}
          <path 
            d="M18 16L22 32L26 20L30 32L34 16" 
            stroke="#0EA5E9" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.7"
          />
          
          {/* Decorative element */}
          <circle cx="24" cy="24" r="16" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.4"/>
        </svg>
        <h1 className="text-3xl font-bold">Works Wise Legal Assistant</h1>
      </div>
      
      <p className="text-lg text-muted-foreground mb-6">
        Ask legal questions and get AI-powered answers to assist with your cases
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-3 py-1.5 rounded-full">
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Legal Research</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 px-3 py-1.5 rounded-full">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Risk Analysis</span>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 px-3 py-1.5 rounded-full">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">Document Drafting</span>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryHeader;
