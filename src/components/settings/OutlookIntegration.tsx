import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function OutlookIntegration() {
  const [connected, setConnected] = useState<boolean>(
    localStorage.getItem('outlook-connected') === 'true'
  );
  const [email, setEmail] = useState<string>(
    localStorage.getItem('outlook-email') || ''
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  const handleConnect = () => {
    if (!email.trim()) {
      toast.error("Please enter your Outlook email address");
      return;
    }
    
    if (!email.includes('@') || !email.endsWith('.com')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsConnecting(true);
    toast.success("Connecting to Outlook...");
    
    setTimeout(() => {
      localStorage.setItem('outlook-connected', 'true');
      localStorage.setItem('outlook-email', email);
      setConnected(true);
      setIsConnecting(false);
      toast.success("Successfully connected to Outlook");
    }, 1500);
  };
  
  const handleDisconnect = () => {
    localStorage.removeItem('outlook-connected');
    localStorage.removeItem('outlook-email');
    setConnected(false);
    setEmail('');
    toast.success("Disconnected from Outlook");
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="outlook-email">Email Address</Label>
        {!connected ? (
          <div className="space-y-2">
            <Input
              id="outlook-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@outlook.com"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleConnect} 
                size="sm"
                disabled={isConnecting}
                className="gap-1"
              >
                {isConnecting ? "Connecting..." : "Connect to Outlook"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://outlook.office.com', '_blank')}
                className="gap-1 ml-auto"
              >
                <ExternalLink className="h-4 w-4" />
                Open Outlook
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted px-3 py-1.5 rounded text-sm">
                {email}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setConnected(false)}
              >
                Edit
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Connected to Outlook</span>
            </div>
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              className="gap-1 mt-2"
            >
              <XCircle className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Connect your Microsoft Outlook account to send documents directly from the application.
        </p>
      </div>
    </div>
  );
}
