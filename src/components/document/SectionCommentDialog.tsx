
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DocumentSection } from '@/utils/documents/types';

interface SectionCommentDialogProps {
  section: DocumentSection;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export function SectionCommentDialog({ section, onClose, onSubmit }: SectionCommentDialogProps) {
  const [comment, setComment] = useState('');
  
  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment to Section: {section.title}</DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          <div className="p-3 bg-muted/30 rounded-md mb-3 text-sm">
            <p className="font-medium text-xs text-muted-foreground mb-1">Section Preview:</p>
            {section.content.substring(0, 150)}
            {section.content.length > 150 ? '...' : ''}
          </div>
          
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment here..."
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!comment.trim()}>Add Comment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
