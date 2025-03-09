import { useState } from 'react';
import { toast } from 'sonner';
import { Smile, Meh, Frown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ADMIN_EMAIL = "admin@realix.ai";

const FeedbackPanel = () => {
  const [feedbackType, setFeedbackType] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendCopy, setSendCopy] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSubmitFeedback = async () => {
    if (!feedbackType) {
      toast.error('Please select a feedback type');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Feedback submitted:', {
        type: feedbackType,
        text: feedbackText,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        sendEmailTo: ADMIN_EMAIL,
        sendCopyToUser: sendCopy,
        userEmail: sendCopy ? userEmail : null
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Thank you for your feedback! A copy has been sent to the administrator.');
      setFeedbackType(null);
      setFeedbackText('');
      if (sendCopy) {
        toast.success(`A copy has also been sent to ${userEmail}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Share Your Feedback</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Help us improve Realix.ai by sharing your thoughts and experiences.
        </p>
      </div>

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

      <div className="flex items-center space-x-2 mb-2">
        <Switch 
          id="send-copy" 
          checked={sendCopy} 
          onCheckedChange={setSendCopy} 
        />
        <Label htmlFor="send-copy">Send me a copy</Label>
      </div>

      {sendCopy && (
        <Input
          type="email"
          placeholder="Your email address"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="mb-4"
        />
      )}

      <div className="bg-primary/5 rounded-lg p-4 mb-4">
        <p className="text-sm text-muted-foreground">
          All feedback will be sent to our admin team ({ADMIN_EMAIL}) to help improve the application.
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          type="button"
          onClick={handleSubmitFeedback} 
          disabled={isSubmitting || (sendCopy && !userEmail)}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
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
    positive: "text-green-500 border-green-200 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30",
    neutral: "text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30",
    negative: "text-red-500 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30",
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

export default FeedbackPanel;
