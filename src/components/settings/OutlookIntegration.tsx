
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function OutlookIntegration() {
  const [connected, setConnected] = useState<boolean>(
    localStorage.getItem('outlook-connected') === 'true'
  );
  const [email, setEmail] = useState<string>(
    localStorage.getItem('outlook-email') || ''
  );
  
  const handleConnect = () => {
    if (!email.trim()) {
      toast.error("Please enter your Outlook email address");
      return;
    }
    
    if (!email.includes('@') || !email.endsWith('.com')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Simulate authentication with Microsoft - in a real implementation,
    // this would redirect to Microsoft's OAuth flow
    toast.success("Connecting to Outlook...");
    
    // Simulate a successful connection after 1.5 seconds
    setTimeout(() => {
      localStorage.setItem('outlook-connected', 'true');
      localStorage.setItem('outlook-email', email);
      setConnected(true);
      toast.success("Successfully connected to Outlook");
    }, 1500);
  };
  
  const handleDisconnect = () => {
    // Simulate disconnection
    localStorage.removeItem('outlook-connected');
    localStorage.removeItem('outlook-email');
    setConnected(false);
    setEmail('');
    toast.success("Disconnected from Outlook");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Microsoft Outlook Integration</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Connect your Microsoft Outlook account to send documents directly from the application.
        </p>
        
        {!connected ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="outlook-email">Outlook Email</Label>
              <Input
                id="outlook-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@outlook.com"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleConnect} className="gap-1">
                <Mail className="h-4 w-4" />
                Connect to Outlook
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://outlook.office.com', '_blank')}
                className="gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Open Outlook
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Connected to Outlook</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              className="gap-1"
            >
              <XCircle className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
