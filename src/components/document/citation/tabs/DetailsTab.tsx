
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCaseDetails } from '@/services/caseLawService';
import { toast } from 'sonner';

interface DetailsTabProps {
  selectedCaseId: string | null;
  onInsertCitation: (citation: string) => void;
  onInsertCaseText: (text: string) => void;
}

export function DetailsTab({ selectedCaseId, onInsertCitation, onInsertCaseText }: DetailsTabProps) {
  const { data: caseDetails, isLoading: isLoadingDetails } = useCaseDetails(selectedCaseId);

  // Insert search result as citation
  const insertSearchResult = (id: string, name: string, citation: string, year: number, court: string) => {
    onInsertCitation(`${name}, ${citation} (${court} ${year})`);
    toast.success('Citation inserted');
  };

  // Handle inserting case text
  const handleInsertCaseText = () => {
    if (caseDetails?.fullText) {
      onInsertCaseText(caseDetails.fullText);
      toast.success('Case text inserted');
    } else {
      toast.error('No case text available');
    }
  };

  return (
    <div className="space-y-4">
      {isLoadingDetails ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : caseDetails ? (
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{caseDetails.name}</h3>
            <p className="text-sm text-muted-foreground">
              {caseDetails.citation} ({caseDetails.court}, {caseDetails.year})
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-1">Summary</h4>
            <p className="text-sm">{caseDetails.summary}</p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-1">Full Text</h4>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              <pre className="text-xs whitespace-pre-wrap font-mono">
                {caseDetails.fullText}
              </pre>
            </ScrollArea>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => insertSearchResult(
                caseDetails.id, 
                caseDetails.name, 
                caseDetails.citation, 
                caseDetails.year, 
                caseDetails.court
              )}
              variant="outline"
              className="flex-1"
            >
              Insert Citation
            </Button>
            <Button 
              onClick={handleInsertCaseText}
              className="flex-1"
            >
              Insert Full Text
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          No case selected. Search for a case first.
        </div>
      )}
    </div>
  );
}

export default DetailsTab;
