import { useState } from 'react';
import { Cloud } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DirectIManageEditor from './DirectIManageEditor';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIManageConnection } from '@/hooks/document/useIManageConnection';
import IManageConfigDialog from './IManageConfigDialog';

interface DirectIManageEditorDialogProps {
  documentId: string;
  buttonSize?: 'xs' | 'sm' | 'default' | 'lg' | 'icon';
  buttonLabel?: string;
}

const DirectIManageEditorDialog = ({ 
  documentId, 
  buttonSize = 'xs',
  buttonLabel = "Edit in iManage" 
}: DirectIManageEditorDialogProps) => {
  const [open, setOpen] = useState(false);
  const { isConnected, checkConnection } = useIManageConnection(open);
  const [showConfig, setShowConfig] = useState(false);
  
  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      const connected = await checkConnection();
      if (!connected) {
        setShowConfig(true);
        return;
      }
    }
    setOpen(newOpen);
  };
  
  const handleConfigClose = async () => {
    setShowConfig(false);
    await checkConnection();
  };
  
  // Render the appropriate button based on size
  const renderTriggerContent = () => {
    if (buttonSize === 'icon') {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          aria-label={buttonLabel}
        >
          <Cloud className="h-5 w-5 text-muted-foreground" />
        </Button>
      );
    }
    
    return (
      <Button
        variant="outline"
        size={buttonSize}
        className={buttonSize === 'lg' ? 'gap-2' : 'gap-1'}
      >
        <Cloud className={buttonSize === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        {buttonLabel}
      </Button>
    );
  };

  return (
    <>
      {showConfig ? (
        <IManageConfigDialog 
          open={showConfig} 
          onOpenChange={(open) => {
            if (!open) handleConfigClose();
          }}
        />
      ) : (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          {buttonSize === 'icon' ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  {renderTriggerContent()}
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{buttonLabel}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <DialogTrigger asChild>
              {renderTriggerContent()}
            </DialogTrigger>
          )}
          
          <DialogContent className="max-w-4xl h-[80vh]">
            {open && (
              <DirectIManageEditor 
                externalId={documentId} 
                onClose={() => setOpen(false)} 
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DirectIManageEditorDialog;
