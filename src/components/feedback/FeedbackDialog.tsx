
import { useState } from 'react';
import { toast } from 'sonner';
import { Smile, Meh, Frown, Send, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const [feedbackType, setFeedbackType] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedbackType) {
      toast.error('Please select a feedback type');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you'd send this to your backend
      console.log('Feedback submitted:', {
        type: feedbackType,
        text: feedbackText,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Thank you for your feedback!');
      setFeedbackType(null);
      setFeedbackText('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Realix.ai by sharing your thoughts and experiences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-2">
          <div className="flex justify-center space-x-6">
            <FeedbackButton
              type="positive"
              icon={<Smile />}
              label="Positive"
              selected={feedbackType === 'positive'}
              onClick={() => setFeedbackType('positive')}
            />
            <FeedbackButton
              type="neutral"
              icon={<Meh />}
              label="Neutral"
              selected={feedbackType === 'neutral'}
              onClick={() => setFeedbackType('neutral')}
            />
            <FeedbackButton
              type="negative"
              icon={<Frown />}
              label="Negative"
              selected={feedbackType === 'negative'}
              onClick={() => setFeedbackType('negative')}
            />
          </div>

          <Textarea
            placeholder="Tell us more about your experience..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FeedbackButtonProps {
  type: 'positive' | 'neutral' | 'negative';
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FeedbackButton = ({ type, icon, label, selected, onClick }: FeedbackButtonProps) => {
  const colorClasses = {
    positive: "text-green-500 border-green-200 bg-green-50 hover:bg-green-100",
    neutral: "text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100",
    negative: "text-red-500 border-red-200 bg-red-50 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-3 rounded-lg border transition-all",
        colorClasses[type],
        selected && "ring-2 ring-primary/20"
      )}
    >
      <div className="text-xl mb-1">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default FeedbackDialog;
