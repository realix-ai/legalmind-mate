import { useState, useEffect } from 'react';
import { Cloud, Link2, Link2Off } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  setIManageCredentials,
  clearIManageCredentials,
  getIManageUrl,
  checkIManageConnection,
} from '@/services/imanage';

interface IManageConfigDialogProps {
  inSettings?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const IManageConfigDialog = ({ inSettings = false, open: controlledOpen, onOpenChange }: IManageConfigDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;
  
  useEffect(() => {
    if (open) {
      // Load saved values
      setUrl(getIManageUrl());
      setToken(localStorage.getItem('imanage-token') || '');
      
      // Check connection
      checkConnection();
    }
  }, [open]);
  
  const checkConnection = async () => {
    setIsChecking(true);
    const connected = await checkIManageConnection();
    setIsConnected(connected);
    setIsChecking(false);
    return connected;
  };
  
  const handleSave = () => {
    try {
      if (!url.trim()) {
        toast.error("iManage URL required");
        return;
      }
      
      if (!token.trim()) {
        toast.error("API token required");
        return;
      }
      
      setIManageCredentials(url, token);
      checkConnection();
      
      toast.success("iManage connection configured");
    } catch (error) {
      console.error("Error saving iManage configuration:", error);
      toast.error("There was an error saving your iManage configuration.");
    }
  };
  
  const handleDisconnect = () => {
    clearIManageCredentials();
    setIsConnected(false);
    toast.success("Disconnected from iManage");
  };

  const renderTriggerButton = () => {
    if (inSettings) {
      return (
        <Button
          variant="outline"
          size="default"
          className="w-full"
        >
          {isConnected ? "Manage iManage Connection" : "Connect to iManage"}
        </Button>
      );
    }
    
    return (
      <Button
        variant="outline"
        size="xs"
        className="gap-1"
      >
        <Cloud className="h-3.5 w-3.5" />
        iManage
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {renderTriggerButton()}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Connect to iManage</DialogTitle>
          <DialogDescription>
            Configure your connection to iManage Work document management system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 py-1 px-3 rounded-full text-sm">
                <Link2 className="h-4 w-4" />
                <span>Connected to iManage</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 py-1 px-3 rounded-full text-sm">
                <Link2Off className="h-4 w-4" />
                <span>Not connected</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imanage-url" className="text-right">
              iManage URL
            </Label>
            <Input
              id="imanage-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://your-imanage-instance.com/api/v2"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-token" className="text-right">
              API Token
            </Label>
            <Input
              id="api-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="col-span-3"
              placeholder="Enter your iManage API token"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {isConnected && (
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="mr-auto"
            >
              Disconnect
            </Button>
          )}
          <div>
            <Button 
              variant="outline" 
              onClick={checkConnection}
              disabled={isChecking}
              className="mr-2"
            >
              {isChecking ? 'Checking...' : 'Test Connection'}
            </Button>
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IManageConfigDialog;
