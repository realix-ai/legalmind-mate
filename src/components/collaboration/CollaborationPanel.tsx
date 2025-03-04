
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Share2, MessageSquare, Copy, Trash, Clock } from 'lucide-react';
import { 
  getTeamMembers, 
  getSharedQueries, 
  getActivityItems,
  inviteTeamMember,
  shareQuery,
  generateShareLink,
  deleteSharedQuery,
  TeamMember,
  SharedQuery,
  ActivityItem
} from '@/services/collaborationService';
import { format } from 'date-fns';

const CollaborationPanel = () => {
  const [shareURL, setShareURL] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sharedQueries, setSharedQueries] = useState<SharedQuery[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [queryToShare, setQueryToShare] = useState('');
  const [queryType, setQueryType] = useState('legal-research');
  
  // Load collaboration data
  useEffect(() => {
    setTeamMembers(getTeamMembers());
    setSharedQueries(getSharedQueries());
    setActivityItems(getActivityItems());
  }, []);
  
  const handleGenerateShareLink = () => {
    if (!queryToShare.trim()) {
      toast.error('Please enter a query to share');
      return;
    }
    
    const newLink = generateShareLink(queryToShare);
    setShareURL(newLink);
    
    // Create shared query in storage
    const newQuery = shareQuery(queryToShare, queryType);
    setSharedQueries([newQuery, ...sharedQueries]);
    
    toast.success('Share link generated successfully');
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
    
    if (inviteTeamMember(inviteEmail)) {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      
      // Refresh team members list
      setTeamMembers(getTeamMembers());
      // Refresh activity
      setActivityItems(getActivityItems());
    } else {
      toast.error('Invalid email address');
    }
  };
  
  const handleDeleteQuery = (id: string) => {
    if (deleteSharedQuery(id)) {
      setSharedQueries(sharedQueries.filter(query => query.id !== id));
      toast.success('Query deleted successfully');
    }
  };
  
  const formatRelativeTime = (date: number): string => {
    const now = new Date();
    const diff = now.getTime() - date;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    return 'Just now';
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
                    <p className="text-sm text-muted-foreground">Share your current query with the team</p>
                    
                    <div className="space-y-3">
                      <Input
                        value={queryToShare}
                        onChange={(e) => setQueryToShare(e.target.value)}
                        placeholder="Enter a query to share"
                      />
                      
                      <div className="flex space-x-2">
                        <select 
                          className="px-3 py-2 border rounded-md text-sm bg-background"
                          value={queryType}
                          onChange={(e) => setQueryType(e.target.value)}
                        >
                          <option value="legal-research">Legal Research</option>
                          <option value="risk-analysis">Risk Analysis</option>
                          <option value="case-summary">Case Summary</option>
                          <option value="document-analysis">Document Analysis</option>
                        </select>
                        
                        <Button onClick={handleGenerateShareLink}>
                          Generate Link
                        </Button>
                      </div>
                    </div>
                    
                    {shareURL && (
                      <div className="flex gap-2 mt-4">
                        <Input
                          value={shareURL}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button size="sm" onClick={handleCopyLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Recently Shared Queries</h4>
                    {sharedQueries.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No shared queries yet</p>
                    ) : (
                      <div className="space-y-2">
                        {sharedQueries.map(item => (
                          <div 
                            key={item.id}
                            className="p-3 border rounded-md mb-2 text-sm group"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{item.query}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">{formatRelativeTime(item.date)}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteQuery(item.id)}
                                >
                                  <Trash className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                              <span>Shared by: {item.sharedBy}</span>
                              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5">
                                {item.type.replace('-', ' ')}
                              </span>
                            </div>
                            {item.url && (
                              <div className="mt-2 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs h-7"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.url!);
                                    toast.success('Share link copied to clipboard');
                                  }}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy Link
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                    {teamMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No team members yet</p>
                    ) : (
                      teamMembers.map(member => (
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
                          
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
                {activityItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No recent activity</p>
                ) : (
                  activityItems.map((item, index) => {
                    // Group by day
                    const date = new Date(item.timestamp);
                    let dateLabel: string;
                    
                    const now = new Date();
                    if (date.toDateString() === now.toDateString()) {
                      dateLabel = 'Today';
                    } else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
                      dateLabel = 'Yesterday';
                    } else {
                      dateLabel = format(date, 'MMM d');
                    }
                    
                    return (
                      <div key={item.id} className="border-l-2 border-primary/30 pl-3 pb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{dateLabel} at {format(date, 'h:mm a')}</p>
                        </div>
                        <p className="text-sm mt-1">
                          <span className="font-medium">{item.userName}</span> {item.action}
                          {item.target && <span className="italic"> {item.target}</span>}
                        </p>
                      </div>
                    );
                  })
                )}
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
