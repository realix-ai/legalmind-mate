
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import EmailDialog from '@/components/ai-communication/EmailDialog';

interface EmailToolbarButtonProps {
  content: string;
  subject?: string;
  buttonSize?: 'icon' | 'sm' | 'default';
  showLabel?: boolean;
  disabled?: boolean;
}

const EmailToolbarButton = ({
  content,
  subject = "AI Assistant Content",
  buttonSize = 'icon',
  showLabel = false,
  disabled = false
}: EmailToolbarButtonProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handleClick = () => {
    setShowEmailDialog(true);
  };

  const renderButton = () => {
    if (buttonSize === 'icon') {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
              onClick={handleClick}
              disabled={disabled}
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Email content</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Button
        variant="outline"
        size={buttonSize}
        className="flex items-center gap-1"
        onClick={handleClick}
        disabled={disabled}
      >
        <Mail className="h-4 w-4" />
        {showLabel && "Email"}
      </Button>
    );
  };

  return (
    <>
      {renderButton()}
      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        content={content}
        subject={subject}
      />
    </>
  );
};

export default EmailToolbarButton;
