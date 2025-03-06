
import { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorWelcomeTipProps {
  documentId: string | null;
}

const EditorWelcomeTip = ({ documentId }: EditorWelcomeTipProps) => {
  const [showTip, setShowTip] = useState(false);
  
  useEffect(() => {
    // Only show tip for new documents (no ID yet) or if user hasn't dismissed it before
    const tipDismissed = localStorage.getItem('editor_welcome_tip_dismissed');
    if (!tipDismissed) {
      setShowTip(true);
    }
  }, [documentId]);
  
  const handleDismiss = () => {
    setShowTip(false);
    localStorage.setItem('editor_welcome_tip_dismissed', 'true');
  };
  
  if (!showTip) return null;
  
  return (
    <div className="bg-primary/10 rounded-md p-4 mb-4 relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-1 right-1 h-6 w-6 p-0" 
        onClick={handleDismiss}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex gap-3 items-start">
        <div className="bg-primary/20 p-2 rounded">
          <Keyboard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Pro Tip: Keyboard Shortcuts</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Use <kbd className="px-1 bg-muted rounded border">Ctrl+B</kbd> for bold, 
            <kbd className="px-1 bg-muted rounded border">Ctrl+I</kbd> for italic, and 
            <kbd className="px-1 bg-muted rounded border">Ctrl+K</kbd> to see all shortcuts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorWelcomeTip;
