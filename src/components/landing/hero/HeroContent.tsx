
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import FeaturesGrid from './FeaturesGrid';

const HeroContent = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="text-center lg:text-left lg:col-span-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex lg:justify-start justify-center mb-6"
      >
        <img 
          src="/lovable-uploads/a6a6474a-8323-47ad-847f-a072100060b7.png" 
          alt="Realix.ai Logo" 
          className="h-20 w-auto mb-4"
          style={{ 
            filter: `drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.25))`
          }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="inline-block mb-6"
      >
        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide">
          AI-Powered Legal Assistant
        </span>
      </motion.div>
      
      <motion.h1
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Transform Your Legal Practice with{" "}
        <span className="text-primary">Intelligent AI</span>
      </motion.h1>
      
      <motion.p
        className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Streamline research, document drafting, and case management with our powerful AI assistant built specifically for legal professionals.
      </motion.p>
      
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button 
          size="lg" 
          className="gap-2 shadow-md hover:shadow-lg transition-all"
          onClick={() => navigate('/query-assistant')}
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="border-2 hover:bg-accent/30"
          onClick={() => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
              featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Learn More
        </Button>
      </motion.div>
      
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <FeaturesGrid />
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
