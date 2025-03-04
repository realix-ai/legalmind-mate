import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Loader2,
} from 'lucide-react';
import { toast } from "sonner";
import Navigation from '@/components/Navigation';
import QueryOptions from '@/components/QueryOptions';
import { processLegalQuery, QueryType } from '@/services/legalQueryService';

const QueryAssistant = () => {
  const [query, setQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<QueryType>('legal-research');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsProcessing(true);
    setResponse(null);
    
    try {
      const result = await processLegalQuery(query.trim(), selectedOption);
      
      if (result.status === 'success') {
        setResponse(result.content);
        toast.success('Query processed successfully');
      } else {
        toast.error('Failed to process query');
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
          
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative mb-6">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your legal question or issue..."
                  className="w-full min-h-[120px] p-4 pr-12 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-y"
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3"
                  disabled={!query.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <p className="text-sm font-medium mb-2">Select analysis type:</p>
              <QueryOptions
                onSelect={(option) => setSelectedOption(option as QueryType)}
                selectedOption={selectedOption}
              />
            </form>
          </motion.div>
        </motion.div>
        
        {(isProcessing || response) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mt-8"
          >
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted p-4">
                <h3 className="font-medium">Response</h3>
              </div>
              
              <div className="p-6">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                    </div>
                    <p className="text-muted-foreground">Processing your query...</p>
                  </div>
                ) : (
                  <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 text-sm md:text-base">{response}</pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default QueryAssistant;
