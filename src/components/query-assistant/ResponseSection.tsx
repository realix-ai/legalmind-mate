
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QueryResponseDisplay from "@/components/QueryResponseDisplay";
import CitationBox from "@/components/citation/CitationBox";
import { MessageSquare, Edit, Check } from "lucide-react";
import { Citation } from "@/services/citationService";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ResponseSectionProps {
  isProcessing: boolean;
  response: string | null;
  onShare: () => void;
  citations: Citation[];
  onResponseEdit?: (editedResponse: string) => void;
}

const ResponseSection = ({ 
  isProcessing, 
  response, 
  onShare, 
  citations, 
  onResponseEdit 
}: ResponseSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState<string | null>(null);
  
  // Only show if there's a response or we're processing
  if (!isProcessing && !response) return null;
  
  // Check if OpenAI API is being used
  const isUsingOpenAI = Boolean(localStorage.getItem('openai-api-key'));
  
  const handleEditToggle = () => {
    if (isEditing && editedResponse !== null) {
      // Save the edits
      if (onResponseEdit) {
        onResponseEdit(editedResponse);
      }
      toast.success("Response revised successfully");
    }
    
    if (!isEditing && response) {
      // Start editing with the current response
      setEditedResponse(response);
    }
    
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Results
        </h2>
        
        <div className="flex gap-2">
          {!isProcessing && response && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEditToggle}
                className="flex items-center gap-1.5"
              >
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4" />
                    Save Revisions
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Revise Results
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="border rounded-xl p-6">
          <Textarea
            value={editedResponse || ""}
            onChange={(e) => setEditedResponse(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      ) : (
        <QueryResponseDisplay 
          isProcessing={isProcessing}
          response={response}
          onShare={onShare}
        />
      )}
      
      {!isProcessing && response && citations.length > 0 && !isEditing && (
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
