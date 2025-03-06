
import React, { useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import Navigation from '@/components/Navigation';

const Index = () => {
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-14"> {/* Added pt-14 to account for fixed header */}
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
