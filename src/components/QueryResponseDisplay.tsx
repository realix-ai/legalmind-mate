
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface QueryResponseDisplayProps {
  isProcessing: boolean;
  response: string | null;
}

const QueryResponseDisplay = ({ isProcessing, response }: QueryResponseDisplayProps) => {
  // Don't show anything if we're not processing and have no response
  if (!isProcessing && !response) {
    console.log("QueryResponseDisplay: No processing or response, not rendering");
    return null;
  }
  
  console.log("QueryResponseDisplay: Rendering with isProcessing =", isProcessing, "response =", response ? "present" : "none");
  
  return (
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
  );
};

export default QueryResponseDisplay;
