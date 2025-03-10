
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptToolbarProps {
  onAddClick: () => void;
  onExportClick: () => void;
}

const PromptToolbar = ({ onAddClick, onExportClick }: PromptToolbarProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2"
        onClick={onExportClick}
        title="Export prompts"
      >
        <Save className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2"
        onClick={onAddClick}
        title="Add new prompt"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default PromptToolbar;
