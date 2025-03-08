
import QueryResponseDisplay from '@/components/QueryResponseDisplay';
import { Citation } from '@/services/citationService';
import CitationBox from '@/components/citation/CitationBox';

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
  const handleEdit = () => {
    if (onResponseEdit && response) {
      // For a real implementation, this would open an editor
      // For now, we'll just call the edit function with the same content
      onResponseEdit(response);
    }
  };

  return (
    <div className="mt-10">
      <QueryResponseDisplay 
        isProcessing={isProcessing} 
        response={response}
        onShare={onShare}
        onEdit={onResponseEdit ? handleEdit : undefined}
      />
      
      {!isProcessing && response && (
        <div className="max-w-4xl mx-auto mt-8">
          <h3 className="text-xl font-medium mb-4">Related Citations</h3>
          {citations.length > 0 ? (
            <CitationBox citations={citations} />
          ) : (
            <div className="bg-background rounded-md p-4 text-sm border">
              <p className="text-muted-foreground">No relevant citations found for this query. Try a more specific legal query to see related citations.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseSection;
