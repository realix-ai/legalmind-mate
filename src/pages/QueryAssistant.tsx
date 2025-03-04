
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import QueryTabs from '@/components/query-assistant/QueryTabs';
import UserWelcome from '@/components/query-assistant/UserWelcome';
import { useLegalQuery } from '@/hooks/use-legal-query';
import { useUserProfile } from '@/hooks/use-user-profile';

const QueryAssistant = () => {
  const [activeTab, setActiveTab] = useState('query');
  const { userName } = useUserProfile();
  const { 
    isProcessing, 
    response, 
    citations, 
    handleSubmit, 
    handleShareQuery 
  } = useLegalQuery(setActiveTab);

  useEffect(() => {
    console.log("QueryAssistant component mounted, userName:", userName);
  }, [userName]);

  return (
    <div className="min-h-screen pb-16 relative">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto px-4 pt-16">
        <QueryTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isProcessing={isProcessing}
          response={response}
          handleSubmit={handleSubmit}
          onShare={handleShareQuery}
          citations={citations}
        />
      </main>

      <UserWelcome userName={userName} />
    </div>
  );
};

export default QueryAssistant;
