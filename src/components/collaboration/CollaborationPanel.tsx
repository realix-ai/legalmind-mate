
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Share2, Users, History, UserCircle2 } from 'lucide-react';
import { 
  getTeamMembers, 
  getSharedQueries, 
  getActivityItems,
  ActivityItem,
  TeamMember,
  SharedQuery
} from '@/services/collaborationService';

// Import the component files
import ShareQueryTab from './ShareQueryTab';
import TeamMembersTab from './TeamMembersTab';
import ActivityFeed from './ActivityFeed';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

  // Filter active collaborators - check if status exists before comparing
  const activeCollaborators = teamMembers.filter(member => 
    member.status === 'online' || member.status === 'active'
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Collaboration overview */}
      <Card className="mb-6 border-primary/20 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Active collaborators */}
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Badge className="bg-green-500 h-2 w-2 p-0 rounded-full mr-2" />
                Active collaborators ({activeCollaborators.length})
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {activeCollaborators.length > 0 ? (
                  activeCollaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex items-center bg-primary/5 rounded-full px-2 py-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {collaborator.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{collaborator.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No active team members</p>
                )}
              </div>
            </div>
            
            {/* Recent activity summary */}
            <Separator orientation="vertical" className="hidden md:block" />
            
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <History className="h-4 w-4 mr-2" />
                Recent activity
              </h3>
              
              {activityItems.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {activityItems.slice(0, 2).map(item => (
                    <li key={item.id} className="flex items-center gap-2 text-muted-foreground">
                      <UserCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {item.title || `${item.userName} ${item.action}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No recent activity</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Collaboration Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="share" className="mt-2">
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
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activityItems={activityItems} />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborationPanel;
