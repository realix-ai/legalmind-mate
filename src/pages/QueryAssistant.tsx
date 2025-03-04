
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import Navigation from '@/components/Navigation';
import QueryForm from '@/components/QueryForm';
import QueryResponseDisplay from '@/components/QueryResponseDisplay';
import { processLegalQuery, QueryType } from '@/services/legalQueryService';

const QueryAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  // Log when component mounts
  useEffect(() => {
    console.log("QueryAssistant component mounted");
  }, []);

  const handleSubmit = async (query: string, selectedOption: QueryType, file: File | null) => {
    setIsProcessing(true);
    setResponse(null);
    
    try {
      console.log("QueryAssistant: Starting to process query:", query);
      console.log("QueryAssistant: Selected option:", selectedOption);
      console.log("QueryAssistant: File information:", file ? {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      } : "No file");
      
      // Explicit check and log for file
      if (file) {
        console.log("QueryAssistant: File is present, proceeding with file processing");
      } else {
        console.log("QueryAssistant: No file attached, proceeding with text-only query");
      }
      
      const result = await processLegalQuery(query, selectedOption, file);
      console.log("QueryAssistant: Received result:", result);
      
      if (result.status === 'success') {
        setResponse(result.content);
        toast.success('Query processed successfully');
      } else {
        toast.error('Failed to process query: ' + (result.content || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

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

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-semibold mb-4 text-center"
          >
            Query Assistant
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-muted-foreground text-center mb-8"
          >
            Ask a legal question and select how you'd like the AI to process your query.
          </motion.p>
          
          <QueryForm 
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
          />
        </motion.div>
        
        <QueryResponseDisplay
          isProcessing={isProcessing}
          response={response}
        />
      </main>
    </div>
  );
};

export default QueryAssistant;
