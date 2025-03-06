
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface NotesSectionProps {
  notes?: string;
  onUpdateNotes?: (notes: string) => void;
}

const NotesSection = ({ notes = '', onUpdateNotes }: NotesSectionProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleNotesChange = () => {
    if (onUpdateNotes) {
      onUpdateNotes(editedNotes);
      setIsEditingNotes(false);
      toast.success("Notes updated");
    }
  };

  const handleCancelNotesEdit = () => {
    setEditedNotes(notes);
    setIsEditingNotes(false);
  };

  if (!notes && !onUpdateNotes) return null;

  return (
    <div className="mt-4 border-t pt-3">
      {isEditingNotes ? (
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2">
          <Textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add notes..."
            className="text-sm min-h-[60px]"
          />
          <div className="flex justify-end gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancelNotesEdit}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleNotesChange}
              className="h-8 px-2"
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="text-sm text-muted-foreground cursor-text"
          onClick={(e) => {
            e.stopPropagation();
            if (onUpdateNotes) setIsEditingNotes(true);
          }}
        >
          {notes ? notes : "Add notes..."}
        </div>
      )}
    </div>
  );
};

export default NotesSection;
