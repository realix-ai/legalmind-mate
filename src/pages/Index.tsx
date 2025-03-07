
import React, { useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import { Link } from 'react-router-dom';

const Index = () => {
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto pt-20 pb-6 flex justify-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img 
              src="/lovable-uploads/a6a6474a-8323-47ad-847f-a072100060b7.png" 
              alt="Realix.ai Logo" 
              className="h-14 w-auto"
              style={{ 
                filter: `drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))`
              }}
            />
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
            Realix.ai
          </span>
        </Link>
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
