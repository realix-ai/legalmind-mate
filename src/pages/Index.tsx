
import React, { useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

const Index = () => {
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
