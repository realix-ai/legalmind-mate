
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import QueryTabs from '@/components/query-assistant/QueryTabs';
import UserWelcome from '@/components/query-assistant/UserWelcome';
import { useLegalQuery } from '@/hooks/use-legal-query';
import { useUserProfile } from '@/hooks/use-user-profile';
import SettingsDialog from '@/components/settings/SettingsDialog';

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
