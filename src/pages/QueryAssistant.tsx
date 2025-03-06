
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import QueryTabs from '@/components/query-assistant/QueryTabs';
import UserWelcome from '@/components/query-assistant/UserWelcome';
import { useLegalQuery } from '@/hooks/use-legal-query';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import SettingsDialog from '@/components/settings/SettingsDialog';

const QueryAssistant = () => {
  const [activeTab, setActiveTab] = useState('query');
  const [openSettings, setOpenSettings] = useState(false);
  const { userName } = useUserProfile();
  const { 
    isProcessing, 
    response, 
    citations, 
    currentQuery,
    handleSubmit, 
    handleShareQuery 
  } = useLegalQuery(setActiveTab);

  useEffect(() => {
    console.log("QueryAssistant component mounted, userName:", userName);
  }, [userName]);

  // Check if OpenAI API key is configured
  const isOpenAIConfigured = Boolean(localStorage.getItem('openai-api-key'));

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navigation />
      
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="w-full">
          {!isOpenAIConfigured && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Configure ChatGPT Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Add your OpenAI API key to enhance responses with ChatGPT.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setOpenSettings(true)}
                className="gap-1"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          )}
          
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
      />
    </div>
  );
};

export default QueryAssistant;
