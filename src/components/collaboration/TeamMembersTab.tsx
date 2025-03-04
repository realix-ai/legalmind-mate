
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { 
  TeamMember,
  inviteTeamMember,
  getTeamMembers
} from '@/services/collaborationService';

interface TeamMembersTabProps {
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setActivityItems: React.Dispatch<React.SetStateAction<import('@/services/collaborationService').ActivityItem[]>>;
}

const TeamMembersTab = ({ teamMembers, setTeamMembers, setActivityItems }: TeamMembersTabProps) => {
  const [inviteEmail, setInviteEmail] = useState('');
  
  const handleInviteTeamMember = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (inviteTeamMember(inviteEmail)) {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      
      // Refresh team members list
      setTeamMembers(getTeamMembers());
      // Refresh activity items by re-fetching them
      import('@/services/collaborationService').then(({ getActivityItems }) => {
        setActivityItems(getActivityItems());
      });
    } else {
      toast.error('Invalid email address');
    }
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
          />
          <Button onClick={handleInviteTeamMember}>
            Invite
          </Button>
        </div>
      </div>
      
      <h4 className="text-sm font-medium mb-3">Your Team</h4>
      <div className="space-y-2">
        {teamMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No team members yet</p>
        ) : (
          teamMembers.map(member => (
            <TeamMemberItem key={member.id} member={member} />
          ))
        )}
      </div>
    </div>
  );
};

interface TeamMemberItemProps {
  member: TeamMember;
}

const TeamMemberItem = ({ member }: TeamMemberItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button size="sm" variant="ghost">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeamMembersTab;
