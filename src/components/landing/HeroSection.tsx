
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Clock, ShieldCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Create transformations based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);
  
  // Create circular background elements
  const numCircles = 5;
  const circles = Array.from({ length: numCircles });

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
    <section ref={sectionRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
        {/* Animated circles */}
        {circles.map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-primary/5 dark:bg-primary/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${50 + (index * 20)}px`,
              height: `${50 + (index * 20)}px`,
            }}
            animate={{
              y: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
              x: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <motion.div
        className="container max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        style={{ opacity, y, scale }}
      >
        {/* Text Content */}
        <motion.div 
          className="text-center lg:text-left"
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
                filter: `drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))`
              }}
            />
          </motion.div>
          
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
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Transform Your Legal Practice with Intelligent AI
          </motion.h1>
          
          <motion.p
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Streamline research, document drafting, and case management with our powerful AI assistant built specifically for legal professionals.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
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
          
          {/* Feature highlights */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Fast Research</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Time Saving</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Secure & Compliant</span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* App Mockup */}
        <motion.div 
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* Floating mockup with shadow and glow effect */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-xl"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              {/* App interface mockup */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 border-b border-gray-200 dark:border-gray-800 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto font-medium text-sm">Realix.ai - Document Drafting</div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-8 w-20 bg-primary/20 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
