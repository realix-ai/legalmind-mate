
import React, { useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import FeedbackButton from '@/components/feedback/FeedbackButton';

const Index = () => {
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
    console.log('Feedback button should be visible in the bottom-right corner');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <FooterSection />
      
      {/* Fixed position feedback button - improved visibility */}
      <div className="fixed bottom-6 right-6 z-50">
        <FeedbackButton className="shadow-lg bg-white dark:bg-gray-800" />
      </div>
    </div>
  );
};

export default Index;
