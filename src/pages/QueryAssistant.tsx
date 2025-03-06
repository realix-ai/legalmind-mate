
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import QueryTabs from '@/components/query-assistant/QueryTabs';
import UserWelcome from '@/components/query-assistant/UserWelcome';
import { useLegalQuery } from '@/hooks/use-legal-query';
import { useUserProfile } from '@/hooks/use-user-profile';
import SettingsDialog from '@/components/settings/SettingsDialog';
import AiAssistantButton from '@/components/ai/AiAssistantButton';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QueryAssistant = () => {
  const [activeTab, setActiveTab] = useState('query');
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('integrations');
  const { userName } = useUserProfile();
  const { 
    isProcessing, 
    response, 
    citations, 
    currentQuery,
    handleSubmit, 
    handleShareQuery 
  } = useLegalQuery(setActiveTab);

  const handleAssistantResponse = (response: string) => {
    toast.info('AI Tip', {
      description: response,
      duration: 8000,
    });
  };

  // Mock real-time collaborators data
  const activeCollaborators = [
    { id: '1', name: 'John Doe', isActive: true },
    { id: '2', name: 'Jane Smith', isActive: true },
  ];

  useEffect(() => {
    console.log("QueryAssistant component mounted, userName:", userName);
  }, [userName]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navigation />
      
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="w-full">
          {/* Collaboration indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex justify-end"
          >
            <Badge variant="outline" className="flex items-center gap-2 py-1.5 px-3">
              <Users className="h-4 w-4 text-primary" />
              <span>{activeCollaborators.length} collaborators online</span>
            </Badge>
          </motion.div>

          <QueryTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isProcessing={isProcessing}
            response={response}
            handleSubmit={handleSubmit}
            onShare={handleShareQuery}
            citations={citations}
            currentQuery={currentQuery}
          />
        </div>
      </main>

      <UserWelcome userName={userName} />
      
      <SettingsDialog 
        open={openSettings} 
        onOpenChange={setOpenSettings}
        defaultTab={settingsTab}
      />

      {/* Fixed position AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AiAssistantButton 
          context="Query Assistant page. The user can ask legal research questions."
          onAssistantResponse={handleAssistantResponse}
          buttonText="Query Tips"
        />
      </div>
    </div>
  );
};

export default QueryAssistant;
