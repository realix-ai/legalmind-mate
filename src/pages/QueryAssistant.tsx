
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import QueryTabs from '@/components/query-assistant/QueryTabs';
import UserWelcome from '@/components/query-assistant/UserWelcome';
import { useLegalQuery } from '@/hooks/use-legal-query';
import { useUserProfile } from '@/hooks/use-user-profile';
import SettingsDialog from '@/components/settings/SettingsDialog';
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

  // Handle settings dialog open/close
  const handleSettingsOpenChange = (open: boolean) => {
    setTimeout(() => {
      setOpenSettings(open);
    }, 10);
  };

  // Check if OpenAI API key is configured and show a toast if not when AI Communication tab is selected
  useEffect(() => {
    if (activeTab === 'ai-chatbot') {
      const apiKey = localStorage.getItem('openai-api-key');
      if (!apiKey) {
        toast.info('AI Communication Tip', {
          description: 'For the best experience, connect your OpenAI API key in Settings > Integrations.',
          duration: 8000,
        });
      }
    }
  }, [activeTab]);

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
    </div>
  );
};

export default QueryAssistant;
