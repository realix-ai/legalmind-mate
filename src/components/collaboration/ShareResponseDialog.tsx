
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TeamMember } from '@/services/collaboration/types';
import { getTeamMembers } from '@/services/collaboration/teamService';
import { shareResponse } from '@/services/collaboration/notificationService';
import { toast } from 'sonner';

interface ShareResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  query?: string;
}

export function ShareResponseDialog({ 
  open, 
  onOpenChange, 
  content,
  query
}: ShareResponseDialogProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [title, setTitle] = useState('Query Response');
  
  useEffect(() => {
    if (open) {
      // Load team members when dialog opens
      setTeamMembers(getTeamMembers());
      setSelectedMembers([]);
      setTitle('Query Response');
    }
  }, [open]);
  
  const handleShare = () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one team member to share with');
      return;
    }
    
    shareResponse(content, selectedMembers, query, title);
    toast.success(`Shared with ${selectedMembers.length} team member${selectedMembers.length > 1 ? 's' : ''}`);
    onOpenChange(false);
  };
  
  const toggleMember = (memberId: string) => {
    setSelectedMembers(current => 
      current.includes(memberId)
        ? current.filter(id => id !== memberId)
        : [...current, memberId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map(member => member.id));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Response</DialogTitle>
          <DialogDescription>
            Share this response with your colleagues
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter a title for this response"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Recipients</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={toggleSelectAll}
              >
                {selectedMembers.length === teamMembers.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            {teamMembers.length > 0 ? (
              <ScrollArea className="h-52 border rounded-md p-2">
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleMember(member.id)}
                      />
                      <Label
                        htmlFor={`member-${member.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {member.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                <p>No team members found. Add team members in the Collaboration tab.</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={selectedMembers.length === 0}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
