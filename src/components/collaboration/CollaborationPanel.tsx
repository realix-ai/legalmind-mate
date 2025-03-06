
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Share2, Users } from 'lucide-react';
import { 
  getTeamMembers, 
  getSharedQueries, 
  getActivityItems,
  ActivityItem,
  TeamMember,
  SharedQuery
} from '@/services/collaborationService';

// Import the new component files
import ShareQueryTab from './ShareQueryTab';
import TeamMembersTab from './TeamMembersTab';
import ActivityFeed from './ActivityFeed';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const CollaborationPanel = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sharedQueries, setSharedQueries] = useState<SharedQuery[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  
  // Load collaboration data
  useEffect(() => {
    setTeamMembers(getTeamMembers());
    setSharedQueries(getSharedQueries());
    setActivityItems(getActivityItems());
  }, []);

  // Mock active collaborators
  const activeCollaborators = [
    { id: '1', name: 'John Doe', isActive: true },
    { id: '2', name: 'Jane Smith', isActive: true },
    { id: '3', name: 'Mark Johnson', isActive: false }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Prominently display active collaborators */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Active Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {activeCollaborators.map(collaborator => (
                <Avatar key={collaborator.id} className="border-2 border-background">
                  <AvatarFallback className={collaborator.isActive ? "bg-primary/10" : "bg-muted"}>
                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {activeCollaborators.filter(c => c.isActive).length} online now
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share & Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="share">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="share">Share Results</TabsTrigger>
                  <TabsTrigger value="team">Team Members</TabsTrigger>
                </TabsList>
                
                <TabsContent value="share">
                  <ShareQueryTab 
                    sharedQueries={sharedQueries} 
                    setSharedQueries={setSharedQueries} 
                  />
                </TabsContent>
                
                <TabsContent value="team">
                  <TeamMembersTab 
                    teamMembers={teamMembers} 
                    setTeamMembers={setTeamMembers}
                    setActivityItems={setActivityItems}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <ActivityFeed activityItems={activityItems} />
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborationPanel;
