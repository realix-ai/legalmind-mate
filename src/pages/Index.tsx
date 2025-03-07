
import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import { Badge } from '@/components/ui/badge';

// Update this with your actual API URL
const API_URL = 'https://your-backend-server.com/api';

const Index = () => {
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
  }, []);

  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* API Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
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
