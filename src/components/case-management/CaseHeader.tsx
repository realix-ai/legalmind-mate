
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AiAssistantButton from '@/components/ai/AiAssistantButton';
import { toast } from 'sonner';

interface CaseHeaderProps {
  onCreateCase: () => void;
  casesCount: number;
}

const CaseHeader = ({ onCreateCase, casesCount }: CaseHeaderProps) => {
  const handleAssistantResponse = (response: string) => {
    toast.info('AI Tip', {
      description: response,
      duration: 8000,
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Case Management
          {casesCount > 0 && <span className="text-muted-foreground font-normal text-lg ml-2">({casesCount})</span>}
        </h1>
        <p className="text-muted-foreground mt-1">Organize and manage your legal cases</p>
      </div>
      <div className="flex gap-2">
        <AiAssistantButton 
          context="Case Management page. The user can organize and manage legal cases."
          onAssistantResponse={handleAssistantResponse}
          buttonText="Case Tips"
        />
        <Button onClick={onCreateCase} className="ml-2">
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>
    </div>
  );
};

export default CaseHeader;
