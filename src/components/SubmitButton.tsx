
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isProcessing: boolean;
  isDisabled: boolean;
}

const SubmitButton = ({ isProcessing, isDisabled }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      size="icon"
      disabled={isDisabled || isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SubmitButton;
