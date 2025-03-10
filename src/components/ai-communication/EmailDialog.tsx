
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  subject?: string;
}

const EmailDialog = ({ open, onOpenChange, content, subject = '' }: EmailDialogProps) => {
  const [to, setTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>(subject);
  const [emailContent, setEmailContent] = useState<string>(content);
  const [isSending, setIsSending] = useState<boolean>(false);
  
  const isOutlookConnected = localStorage.getItem('outlook-connected') === 'true';
  const outlookEmail = localStorage.getItem('outlook-email') || '';
  
  const handleSendEmail = async () => {
    if (!to.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }
    
    if (!emailSubject.trim()) {
      toast.error("Please enter a subject for your email");
      return;
    }
    
    setIsSending(true);
    
    // In a real application, this would connect to the Outlook API
    // For now, we'll simulate sending the email
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Email sent to ${to}`);
      onOpenChange(false);
      setTo('');
      setEmailSubject('');
      setEmailContent('');
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email via Outlook
          </DialogTitle>
        </DialogHeader>
        
        {!isOutlookConnected ? (
          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-900 p-4 rounded-md text-sm">
              <p className="font-medium mb-2">Outlook not connected</p>
              <p className="text-muted-foreground">
                Please connect your Outlook account in Settings to use this feature.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                // Here you would typically open the settings dialog with the Outlook tab active
                // For now, we'll just show a toast
                toast.info("Please connect Outlook in Settings");
              }}
            >
              Go to Settings
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-sm flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="font-medium">From:</span>
              <span>{outlookEmail}</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">To:</Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject:</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content:</Label>
              <Textarea
                id="content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSending || !to.trim() || !emailSubject.trim()}
                onClick={handleSendEmail}
                className="gap-1"
              >
                <Send className="h-4 w-4" />
                {isSending ? 'Sending...' : 'Send Email'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
