
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Clock, ShieldCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    console.log('HeroSection component rendered');
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
      <div 
        className="absolute inset-0 -z-10 bg-gradient-radial from-white to-gray-50 dark:from-gray-900 dark:to-gray-950"
        style={{ 
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: 1 - scrollY * 0.002
        }}
      />
      
      <motion.div
        className="container max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            AI-Powered Legal Assistant
          </span>
        </motion.div>
        
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Transform Your Legal Practice with Intelligent AI
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Streamline research, document drafting, and case management with our powerful AI assistant built specifically for legal professionals.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => navigate('/query-assistant')}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
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
      </motion.div>
    </section>
  );
};

export default HeroSection;
