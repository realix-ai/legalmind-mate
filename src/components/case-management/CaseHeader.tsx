
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import AiAssistantButton from '@/components/ai/AiAssistantButton';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface CaseHeaderProps {
  onCreateCase?: () => void;
  casesCount?: number;
  setIsCreateCaseDialogOpen: Dispatch<SetStateAction<boolean>>;
  isCreateCaseDialogOpen: boolean;
}

const CaseHeader = ({ 
  onCreateCase, 
  casesCount = 0, 
  setIsCreateCaseDialogOpen, 
  isCreateCaseDialogOpen 
}: CaseHeaderProps) => {
  const handleAssistantResponse = (response: string) => {
    toast.info('AI Tip', {
      description: response,
      duration: 8000,
    });
  };

  const handleCreateCase = () => {
    if (onCreateCase) {
      onCreateCase();
    } else {
      setIsCreateCaseDialogOpen(true);
    }
  };

  // Mock collaborators data
  const collaboratorsCount = 3;

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Case Management
          {casesCount > 0 && <span className="text-muted-foreground font-normal text-lg ml-2">({casesCount})</span>}
        </h1>
        <p className="text-muted-foreground mt-1">Organize and manage your legal cases</p>
      </div>
      <div className="flex gap-2 items-center">
        {/* Collaboration indicator */}
        <Badge variant="outline" className="flex items-center gap-2 py-1.5">
          <Users className="h-4 w-4 text-primary" />
          <span>{collaboratorsCount} collaborators</span>
        </Badge>
        
        <AiAssistantButton 
          context="Case Management page. The user can organize and manage legal cases."
          onAssistantResponse={handleAssistantResponse}
          buttonText="Case Tips"
        />
        <Button onClick={handleCreateCase} className="ml-2">
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>
    </div>
  );
};

export default CaseHeader;
