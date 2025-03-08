
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureButtonProps {
  icon: React.ReactElement;
  text: string;
  index: number;
}

const FeatureButton = ({ icon, text, index }: FeatureButtonProps) => {
  return (
    <motion.div 
      className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 py-2 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
      whileHover={{ 
        y: -2,
        backgroundColor: "rgba(var(--primary-rgb), 0.1)"
      }}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10">
        {React.cloneElement(icon, { className: "h-3.5 w-3.5 text-primary" })}
      </div>
      <span className="text-sm font-medium whitespace-normal">{text}</span>
    </motion.div>
  );
};

export default FeatureButton;
