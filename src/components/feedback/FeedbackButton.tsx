
import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackDialog from './FeedbackDialog';

interface FeedbackButtonProps {
  className?: string;
}

const FeedbackButton = ({ className }: FeedbackButtonProps) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  console.log("FeedbackButton rendering with className:", className);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className={`${className} flex items-center font-medium`}
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
