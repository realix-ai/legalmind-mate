
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const QueryHeader = () => {
  return (
    <>
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
    </>
  );
};

export default QueryHeader;
