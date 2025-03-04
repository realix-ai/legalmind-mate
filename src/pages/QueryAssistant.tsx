
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import Navigation from '@/components/Navigation';
import QueryForm from '@/components/QueryForm';
import QueryResponseDisplay from '@/components/QueryResponseDisplay';
import CitationBox from '@/components/citation/CitationBox';
import UserProfileButton from '@/components/profile/UserProfileButton';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';
import BatchProcessingPanel from '@/components/batch/BatchProcessingPanel';
import { processLegalQuery, QueryType } from '@/services/legalQueryService';
import { fetchRelatedCitations, Citation } from '@/services/citationService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { shareQuery } from '@/services/collaborationService';
import { formatRelativeTime } from '@/components/collaboration/utils';

// Load user profile from localStorage
const loadUserName = () => {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      return profile.name;
    } catch (e) {
      console.error('Error parsing profile data:', e);
    }
  }
  return 'John Doe';
};

const QueryAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('query');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentQueryType, setCurrentQueryType] = useState<QueryType>('legal-research');
  const [userName, setUserName] = useState(loadUserName());

  useEffect(() => {
    console.log("QueryAssistant component mounted");
    
    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile updated event received:', event.detail);
      if (event.detail && event.detail.name) {
        setUserName(event.detail.name);
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  const handleSubmit = async (query: string, selectedOption: QueryType, file: File | null) => {
    setIsProcessing(true);
    setResponse(null);
    setCurrentQuery(query);
    setCurrentQueryType(selectedOption);
    
    try {
      console.log("QueryAssistant: Starting to process query:", query);
      console.log("QueryAssistant: Selected option:", selectedOption);
      console.log("QueryAssistant: File upload has been disabled");
      
      // Always pass null for file since we've removed file upload functionality
      const result = await processLegalQuery(query, selectedOption, null);
      console.log("QueryAssistant: Received result:", result);
      
      if (result.status === 'success') {
        setResponse(result.content);
        toast.success('Query processed successfully');
        
        // Fetch citations related to the query
        const relatedCitations = await fetchRelatedCitations(query);
        setCitations(relatedCitations);
      } else {
        toast.error('Failed to process query: ' + (result.content || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareQuery = () => {
    if (currentQuery && response) {
      const shared = shareQuery(currentQuery, currentQueryType);
      toast.success('Query shared successfully');
      setActiveTab('collaboration');
    } else {
      toast.error('No query results to share');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen pb-16 relative">
      <Navigation />
      
      <div className="container max-w-7xl mx-auto pt-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <UserProfileButton />
        </div>
      </div>
      
      <main className="container max-w-7xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="query">Single Query</TabsTrigger>
            <TabsTrigger value="batch">Batch Processing</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="query">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mx-auto"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-2xl md:text-3xl font-semibold mb-4 text-center"
              >
                Query Assistant
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-muted-foreground text-center mb-8"
              >
                Ask a legal question and select how you'd like the AI to process your query.
              </motion.p>
              
              <QueryForm 
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
              />
            </motion.div>
            
            <QueryResponseDisplay
              isProcessing={isProcessing}
              response={response}
              onShare={handleShareQuery}
              showShareButton={!!response && !isProcessing}
            />
            
            {!isProcessing && citations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                <CitationBox citations={citations} />
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="batch">
            <BatchProcessingPanel />
          </TabsContent>
          
          <TabsContent value="collaboration">
            <CollaborationPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* User name display at the bottom left */}
      <div className="fixed bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
        <span className="text-muted-foreground mr-1">Welcome,</span> {userName}
      </div>
    </div>
  );
};

export default QueryAssistant;
