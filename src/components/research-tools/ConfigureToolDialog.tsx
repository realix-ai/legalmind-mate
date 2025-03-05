
import { useState } from 'react';
import { toast } from 'sonner';
import { ResearchToolType, configureTool } from '@/services/legalResearchToolsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfigureToolDialogProps {
  toolId: ResearchToolType | null;
  toolName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfigureToolDialog = ({
  toolId,
  toolName,
  isOpen,
  onClose,
  onSuccess
}: ConfigureToolDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !toolId) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would validate the API key with the service
      const success = configureTool(toolId, apiKey);
      
      if (success) {
        toast.success(`${toolName} configured successfully`);
        setApiKey('');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to configure. Please check your API key.');
      }
    } catch (error) {
      console.error('Error configuring tool:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {toolName}</DialogTitle>
          <DialogDescription>
            Enter your API key to connect with {toolName}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${toolName} API key`}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never shared with our servers.
              </p>
            </div>
            
            <div className="grid gap-2">
              <p className="text-sm">
                Don't have an API key? Visit the{' '}
                <a 
                  href={toolId === 'westlaw' ? 'https://legal.thomsonreuters.com/en/products/westlaw' : 'https://www.lexisnexis.com/en-us/products/lexis-plus.page'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {toolName} website
                </a>{' '}
                to get one.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureToolDialog;
