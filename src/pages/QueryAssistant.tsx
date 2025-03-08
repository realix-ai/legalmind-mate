
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
    handleShareQuery,
    handleResponseEdit
  } = useLegalQuery(setActiveTab);

  const handleAssistantResponse = (response: string) => {
    toast.info('AI Tip', {
      description: response,
      duration: 8000,
    });
  };

  // Properly handle settings dialog open/close
  const handleSettingsOpenChange = (open: boolean) => {
    setTimeout(() => {
      setOpenSettings(open);
    }, 10);
  };

  useEffect(() => {
    console.log("QueryAssistant component mounted, userName:", userName);
  }, [userName]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navigation />
      
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="w-full">
          <QueryTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isProcessing={isProcessing}
            response={response}
            handleSubmit={handleSubmit}
            onShare={handleShareQuery}
            citations={citations}
            currentQuery={currentQuery}
            onResponseEdit={handleResponseEdit}
          />
        </div>
      </main>

      <UserWelcome userName={userName} />
      
      <SettingsDialog 
        open={openSettings} 
        onOpenChange={handleSettingsOpenChange}
        defaultTab={settingsTab}
      />

      {/* Fixed position assistant button */}
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
