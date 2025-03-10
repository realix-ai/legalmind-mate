
import QueryResponseDisplay from '@/components/QueryResponseDisplay';
import { Citation } from '@/services/citationService';
import CitationBox from '@/components/citation/CitationBox';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ResponseSectionProps {
  isProcessing: boolean;
  response: string | null;
  onShare: () => void;
  citations: Citation[];
  onResponseEdit?: (editedResponse: string) => void;
  query?: string;
}

const ResponseSection = ({ 
  isProcessing, 
  response, 
  onShare, 
  citations,
  onResponseEdit,
  query
}: ResponseSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');

  const handleEdit = () => {
    if (onResponseEdit && response) {
      setEditedResponse(response);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (onResponseEdit && editedResponse.trim()) {
      onResponseEdit(editedResponse);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="mt-10">
      {isEditing && response ? (
        <div className="max-w-4xl mx-auto">
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-muted p-4 flex items-center justify-between">
              <h3 className="font-medium">Edit Response</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
            <div className="p-6">
              <Textarea 
                value={editedResponse} 
                onChange={(e) => setEditedResponse(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>
        </div>
      ) : (
        <QueryResponseDisplay 
          isProcessing={isProcessing} 
          response={response}
          query={query}
          onShare={onShare}
          onEdit={onResponseEdit ? handleEdit : undefined}
        />
      )}
      
      {!isProcessing && response && !isEditing && (
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
