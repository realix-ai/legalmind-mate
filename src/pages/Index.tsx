
import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import { Badge } from '@/components/ui/badge';
import { checkIManageConnection } from '@/services/imanage';

// Update this with your actual API URL
const API_URL = 'https://your-backend-server.com/api';

const Index = () => {
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
    document.title = 'Workswise.ai - AI-Powered Legal Assistant';
  }, []);

  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [imanageStatus, setImanageStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check API connection on load
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Make a real API call to check connection
        const response = await fetch(`${API_URL}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`,
          },
          // Add a timeout to prevent long waits
          signal: AbortSignal.timeout(5000)
        });
        
        const isConnected = response.ok;
        setApiStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Error checking API connection:', error);
        setApiStatus('disconnected');
      }
    };

    checkApiConnection();
  }, []);
  
  // Check iManage connection on load
  useEffect(() => {
    const checkImanageStatus = async () => {
      try {
        const isConnected = await checkIManageConnection();
        setImanageStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Error checking iManage connection:', error);
        setImanageStatus('disconnected');
      }
    };

    checkImanageStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* API Status Indicators */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <Badge variant={apiStatus === 'connected' ? 'default' : 'outline'} className="bg-opacity-70 backdrop-blur-sm">
          {apiStatus === 'checking' ? (
            'Checking API connection...'
          ) : apiStatus === 'connected' ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              API Connected
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              API Disconnected (Using Local Storage)
            </span>
          )}
        </Badge>
        
        <Badge variant={imanageStatus === 'connected' ? 'default' : 'outline'} className="bg-opacity-70 backdrop-blur-sm">
          {imanageStatus === 'checking' ? (
            'Checking iManage connection...'
          ) : imanageStatus === 'connected' ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              iManage Connected
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              iManage Disconnected
            </span>
          )}
        </Badge>
      </div>
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
