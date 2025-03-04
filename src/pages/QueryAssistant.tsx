import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Loader2,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import QueryOptions from '@/components/QueryOptions';

const QueryAssistant = () => {
  const [query, setQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState('legal-research');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsProcessing(true);
    setResponse(null);
    
    // Simulate AI processing
    setTimeout(() => {
      const queryResponses: Record<string, string> = {
        'legal-research': `Based on my research, the case "${query}" relates to several key precedents:
        
1. Smith v. Johnson (2018) - Established the modern interpretation of reasonable doubt in similar contexts.

2. Wilson Corp v. Davidson (2020) - Clarified the application of statutory requirements in this area.

3. Parker Trust v. National Bank (2021) - Set important boundaries for fiduciary responsibility that would be relevant here.

The current statutory framework under Section 423(b) would likely apply to this situation, particularly given the 2022 amendments that expanded its scope.`,

        'risk-analysis': `Risk Analysis for "${query}":

HIGH RISK FACTORS:
• Potential statute of limitations issues (3-year deadline approaching)
• Conflicting precedents in this jurisdiction
• Recent regulatory changes affecting burden of proof

MEDIUM RISK FACTORS:
• Potential for adverse media coverage
• Similar cases have seen unpredictable outcomes
• Expert testimony may be challenged under Daubert standard

LOW RISK FACTORS:
• Strong documentary evidence available
• Favorable venue selection possible
• Opposing counsel has limited experience in this area

RECOMMENDED RISK MITIGATION STRATEGIES:
1. File protective motions by June 15
2. Prepare alternative settlement scenarios
3. Conduct supplemental research on Johnson v. Metropolitan factors`,

        'summarize': `SUMMARY OF "${query}":

CORE ISSUES:
• Breach of fiduciary duty claims relating to investment decisions
• Allegations of improper disclosure of material information
• Disputed timeline of events from 2020-2022

KEY PARTIES:
• Plaintiff corporation (seeking damages of $4.2M)
• Three defendant board members
• Two corporate entities with potential liability

PROCEDURAL STATUS:
• Initial complaint filed March 2023
• Motion to dismiss denied September 2023
• Discovery deadline extended to July 15, 2024
• Trial date set for November 2024

CRITICAL DOCUMENTS:
• Board meeting minutes from April 18, 2021
• Financial disclosure statements from Q3 2021
• Expert witness reports filed February 2024`,

        'data-analysis': `DATA ANALYSIS FOR "${query}":

STATISTICAL FINDINGS:
• 72% of similar cases settled before trial
• Average settlement amount: $1.2M
• Median time to resolution: 14 months
• Cases with similar fact patterns had 63% plaintiff success rate

JURISDICTION INSIGHTS:
• This jurisdiction shows 22% higher damage awards than national average
• Recent trend toward stricter interpretation of statutory requirements
• Judge Williamson has ruled on 8 similar cases (5 for plaintiff, 3 for defense)

LITIGATION COST PROJECTION:
• Estimated total costs through trial: $320,000-$420,000
• Major cost drivers: Expert testimony (35%), document review (28%)
• Settlement probability peaks at months 8-10 of litigation

STRATEGIC RECOMMENDATIONS:
1. Consider early mediation (cost/benefit analysis favorable)
2. Allocate resources to key expert testimony areas
3. Prepare detailed timeline exhibits to clarify disputed sequence`
      };
      
      setResponse(queryResponses[selectedOption] || "I've analyzed your query and compiled relevant information. Would you like me to elaborate on any specific aspect?");
      setIsProcessing(false);
    }, 3000);
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
                onSelect={setSelectedOption}
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
