
import { useState } from 'react';
import { MessageCircle, History, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CollaborationToolbarProps {
  documentId: string;
  onOpenComments: () => void;
  onOpenVersionHistory: () => void;
}

const CollaborationToolbar = ({ 
  documentId, 
  onOpenComments, 
  onOpenVersionHistory 
}: CollaborationToolbarProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(true);
  const [email, setEmail] = useState('');
  
  // Mock user data
  const users = [
    { id: 'user-1', name: 'Jane Smith', email: 'jane@example.com', avatar: '/placeholder.svg' },
    { id: 'user-2', name: 'Robert Johnson', email: 'robert@example.com', avatar: '/placeholder.svg' },
    { id: 'user-3', name: 'Emily Davis', email: 'emily@example.com', avatar: '/placeholder.svg' },
  ];
  
  const handleShare = () => {
    if (selectedUsers.length === 0 && !email) {
      toast.error('Please select users or enter an email');
      return;
    }
    
    // In a real app, this would send sharing information to an API
    toast.success(`Document shared with ${selectedUsers.length + (email ? 1 : 0)} users`);
    setIsShareDialogOpen(false);
    
    console.log('Sharing document:', documentId);
    console.log('Selected users:', selectedUsers);
    console.log('Can edit:', canEdit);
    if (email) console.log('Additional email:', email);
  };
  
  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  return (
    <>
      <div className="flex border-t py-2 px-4 gap-2 justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenComments}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comments</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenVersionHistory}>
                <History className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Version History</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => setIsShareDialogOpen(true)}>
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-email">Share with email</Label>
              <div className="flex gap-2">
                <Input 
                  id="share-email" 
                  placeholder="Enter email address" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="can-edit" 
                checked={canEdit} 
                onCheckedChange={setCanEdit} 
              />
              <Label htmlFor="can-edit">Allow editing</Label>
            </div>
            
            <div className="space-y-2">
              <Label>Team members</Label>
              <div className="border rounded-md divide-y">
                {users.map(user => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleUser(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="h-4 w-4 rounded-sm border flex items-center justify-center">
                      {selectedUsers.includes(user.id) && (
                        <div className="h-2 w-2 bg-primary rounded-sm" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleShare}>Share</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CollaborationToolbar;
