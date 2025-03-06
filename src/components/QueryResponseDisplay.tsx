
import { Loader2, FileText, Download, Mail, Link, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface QueryResponseDisplayProps {
  isProcessing: boolean;
  response: string | null;
  onShare?: () => void;
  showShareButton?: boolean;
}

const processingStages = [
  "Reading file content...",
  "Extracting document data...", 
  "Analyzing legal information...",
  "Generating response..."
];

const QueryResponseDisplay = ({ isProcessing, response, onShare, showShareButton }: QueryResponseDisplayProps) => {
  const [copied, setCopied] = useState(false);
  
  // Don't show anything if we're not processing and have no response
  if (!isProcessing && !response) {
    console.log("QueryResponseDisplay: No processing or response, not rendering");
    return null;
  }
  
  console.log("QueryResponseDisplay: Rendering with isProcessing =", isProcessing, "response =", response ? "present" : "none");
  
  const handleExportPDF = () => {
    if (!response) return;
    
    // Create a hidden iframe with the content
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Write the content to the iframe
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(`
      <html>
        <head>
          <title>Legal Query Response</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
            }
            pre {
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h2>Legal Query Response</h2>
          <pre>${response}</pre>
        </body>
      </html>
    `);
    iframe.contentDocument?.close();
    
    // Print the iframe content
    setTimeout(() => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
      toast.success("Downloaded as PDF");
    }, 500);
  };
  
  const handleEmailShare = () => {
    if (!response) return;
    
    const subject = encodeURIComponent("Legal Query Response");
    const body = encodeURIComponent(response);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success("Email client opened");
  };
  
  const handleCopyLink = () => {
    if (!response) return;
    
    // In a real app, you would generate a shareable link here
    // For now, we'll just copy the current URL
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => setCopied(false), 2000);
  };
  
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
          <div className="flex items-center gap-2">
            {isProcessing && (
              <span className="text-xs text-muted-foreground animate-pulse">Processing...</span>
            )}
            
            {!isProcessing && response && (
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onShare && (
                      <DropdownMenuItem onClick={onShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Results
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Save as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEmailShare}>
                      <Mail className="h-4 w-4 mr-2" />
                      Share via Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Link className="h-4 w-4 mr-2" />
                      Copy Shareable Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
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
