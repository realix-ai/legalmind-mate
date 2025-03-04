
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Share2, MessageSquare, Copy } from 'lucide-react';

// Mock shared queries for demonstration
const MOCK_SHARED_QUERIES = [
  {
    id: '1',
    query: 'Analysis of contract termination clause implications',
    sharedBy: 'Lisa Warren',
    date: '2 days ago',
    type: 'legal-research'
  },
  {
    id: '2',
    query: 'Risk assessment for Smith v. Johnson precedent in our current case',
    sharedBy: 'Mark Thompson',
    date: '1 week ago',
    type: 'risk-analysis'
  }
];

// Mock team members for demonstration
const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Sarah Johnson', role: 'Senior Partner', initials: 'SJ' },
  { id: '2', name: 'David Chen', role: 'Associate', initials: 'DC' },
  { id: '3', name: 'Lisa Warren', role: 'Paralegal', initials: 'LW' },
  { id: '4', name: 'Mark Thompson', role: 'Legal Researcher', initials: 'MT' }
];

const CollaborationPanel = () => {
  const [shareURL, setShareURL] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  
  const handleGenerateShareLink = () => {
    // In a real app, this would generate a unique sharing link
    const mockShareURL = `${window.location.origin}/share/${Math.random().toString(36).substring(2, 8)}`;
    setShareURL(mockShareURL);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareURL);
    toast.success('Link copied to clipboard');
  };
  
  const handleInviteTeamMember = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    // In a real app, this would send an invitation email
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };
  
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
                
                <TabsContent value="share" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Generate a link to share your current query and results</p>
                    <div className="flex gap-2">
                      <Input
                        value={shareURL}
                        readOnly
                        placeholder="Generate a link to share"
                        className="font-mono text-xs"
                      />
                      {shareURL ? (
                        <Button size="sm" onClick={handleCopyLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleGenerateShareLink}>
                          Generate
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Recently Shared Queries</h4>
                    {MOCK_SHARED_QUERIES.map(item => (
                      <div 
                        key={item.id}
                        className="p-3 border rounded-md mb-2 text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{item.query}</span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Shared by: {item.sharedBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="team" className="pt-4">
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
                    {MOCK_TEAM_MEMBERS.map(member => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
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
                        
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary/30 pl-3 pb-4">
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Sarah Johnson</span> shared a new legal research query
                  </p>
                </div>
                
                <div className="border-l-2 border-primary/30 pl-3 pb-4">
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">David Chen</span> commented on your risk analysis
                  </p>
                </div>
                
                <div className="border-l-2 border-primary/30 pl-3">
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Mark Thompson</span> created a new document based on your query
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborationPanel;
