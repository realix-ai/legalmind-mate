
import React, { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, UserPlus, Trash } from 'lucide-react';
import { 
  TeamMember,
  inviteTeamMember,
  getTeamMembers,
  removeTeamMember
} from '@/services/collaborationService';

interface TeamMembersTabProps {
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setActivityItems: React.Dispatch<React.SetStateAction<import('@/services/collaborationService').ActivityItem[]>>;
}

const TeamMembersTab = ({ teamMembers, setTeamMembers, setActivityItems }: TeamMembersTabProps) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInviteTeamMember = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (!isValidEmail(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await inviteTeamMember(inviteEmail);
      
      if (success) {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
        
        // Refresh team members list
        setTeamMembers(getTeamMembers());
        // Refresh activity items by re-fetching them
        import('@/services/collaborationService').then(({ getActivityItems }) => {
          setActivityItems(getActivityItems());
        });
      } else {
        toast.error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error inviting team member:', error);
      toast.error('An error occurred while sending the invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveTeamMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      if (removeTeamMember(id)) {
        toast.success(`${name} has been removed from the team`);
        setTeamMembers(getTeamMembers());
        import('@/services/collaborationService').then(({ getActivityItems }) => {
          setActivityItems(getActivityItems());
        });
      } else {
        toast.error('Failed to remove team member');
      }
    }
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  return (
    <div className="pt-4">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Invite a team member to collaborate</p>
        <div className="flex gap-2">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInviteTeamMember();
              }
            }}
          />
          <Button 
            onClick={handleInviteTeamMember} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Inviting...
              </span>
            ) : (
              <span className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <h4 className="text-sm font-medium mb-3">Your Team</h4>
      <div className="space-y-2">
        {teamMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No team members yet</p>
        ) : (
          teamMembers.map(member => (
            <TeamMemberItem 
              key={member.id} 
              member={member}
              onRemove={() => handleRemoveTeamMember(member.id, member.name)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface TeamMemberItemProps {
  member: TeamMember;
  onRemove: () => void;
}

const TeamMemberItem = ({ member, onRemove }: TeamMemberItemProps) => {
  const isPending = member.role === 'Invited User';
  
  return (
    <div className={`flex items-center justify-between p-2 border rounded-md ${isPending ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className={`${isPending ? 'bg-muted' : 'bg-primary/10'} text-primary`}>
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">
            {isPending ? (
              <span className="text-amber-600">Invitation Pending</span>
            ) : (
              member.role
            )}
          </p>
          {member.email && (
            <p className="text-xs text-muted-foreground">{member.email}</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        {!isPending && (
          <Button size="sm" variant="ghost">
            <MessageSquare className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" variant="ghost" className="text-destructive" onClick={onRemove}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeamMembersTab;
