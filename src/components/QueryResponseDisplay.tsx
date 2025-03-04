
import { Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface QueryResponseDisplayProps {
  isProcessing: boolean;
  response: string | null;
}

const processingStages = [
  "Reading file content...",
  "Extracting document data...", 
  "Analyzing legal information...",
  "Generating response..."
];

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
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-muted p-4 flex items-center justify-between">
          <h3 className="font-medium">Response</h3>
          {isProcessing && (
            <span className="text-xs text-muted-foreground animate-pulse">Processing...</span>
          )}
        </div>
        
        <div className="p-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                <FileText className="h-8 w-8 text-primary/60 absolute" />
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              
              <div className="space-y-2 max-w-xs mx-auto">
                <motion.div 
                  className="h-2 bg-primary/10 rounded overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                >
                  <div className="h-full bg-primary/50 rounded" style={{ width: "30%" }}></div>
                </motion.div>
                
                <p className="text-muted-foreground text-center text-sm">
                  {processingStages[Math.floor(Math.random() * processingStages.length)]}
                </p>
              </div>
            </div>
          ) : (
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 text-sm md:text-base leading-relaxed">{response}</pre>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QueryResponseDisplay;
