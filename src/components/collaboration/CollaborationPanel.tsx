
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Share2 } from 'lucide-react';
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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
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
