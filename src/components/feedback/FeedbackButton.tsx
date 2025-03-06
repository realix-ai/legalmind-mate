
import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackDialog from './FeedbackDialog';

interface FeedbackButtonProps {
  className?: string;
}

const FeedbackButton = ({ className }: FeedbackButtonProps) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setFeedbackOpen(true)}
      >
        <MessageSquarePlus className="h-4 w-4 mr-2" />
        Feedback
      </Button>
      
      <FeedbackDialog 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen} 
      />
    </>
  );
};

export default FeedbackButton;
