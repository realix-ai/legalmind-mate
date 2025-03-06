
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QueryResponseDisplay from "@/components/QueryResponseDisplay";
import CitationBox from "@/components/citation/CitationBox";
import { MessageSquare } from "lucide-react";
import { Citation } from "@/services/citationService";

interface ResponseSectionProps {
  isProcessing: boolean;
  response: string | null;
  onShare: () => void;
  citations: Citation[];
}

const ResponseSection = ({ isProcessing, response, onShare, citations }: ResponseSectionProps) => {
  // Only show if there's a response or we're processing
  if (!isProcessing && !response) return null;
  
  // Check if OpenAI API is being used
  const isUsingOpenAI = Boolean(localStorage.getItem('openai-api-key'));
  
  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Results
          {isUsingOpenAI && !isProcessing && response && (
            <Badge variant="outline" className="gap-1 text-xs py-0">
              <MessageSquare className="h-3 w-3" />
              ChatGPT
            </Badge>
          )}
        </h2>
        
        {!isProcessing && response && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
          >
            Share Results
          </Button>
        )}
      </div>
      
      <QueryResponseDisplay 
        isProcessing={isProcessing}
        response={response}
      />
      
      {!isProcessing && response && citations.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Related Citations</h3>
          <div className="space-y-4">
            {citations.map((citation) => (
              <CitationBox 
                key={citation.id}
                citations={[citation]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseSection;
