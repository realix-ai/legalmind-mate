import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Clock, ShieldCheck, Search, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);
  
  const numWaves = 3;
  const waves = Array.from({ length: numWaves });
  
  const numCircles = 8;
  const circles = Array.from({ length: numCircles });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    { icon: <Zap className="h-4 w-4" />, text: "Fast Research" },
    { icon: <Clock className="h-4 w-4" />, text: "Time Saving" },
    { icon: <ShieldCheck className="h-4 w-4" />, text: "Secure & Compliant" },
    { icon: <BookOpen className="h-4 w-4" />, text: "Comprehensive Database" },
    { icon: <CheckCircle2 className="h-4 w-4" />, text: "High Accuracy" },
    { icon: <Search className="h-4 w-4" />, text: "Advanced Search" },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden px-4 py-20"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
        {waves.map((_, index) => (
          <motion.div
            key={`wave-${index}`}
            className="absolute w-full h-24 opacity-30"
            style={{
              bottom: `${index * 15}%`,
              background: `linear-gradient(90deg, transparent, rgba(99, 102, 241, ${0.03 + index * 0.01}) 30%, rgba(99, 102, 241, ${0.05 + index * 0.01}) 70%, transparent)`,
              height: `${100 + index * 20}px`,
              borderRadius: '50%',
              transform: 'scale(1.5)',
            }}
            animate={{
              x: ['-20%', '120%'],
            }}
            transition={{
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 3,
            }}
          />
        ))}
        {circles.map((_, index) => (
          <motion.div
            key={`circle-${index}`}
            className="absolute rounded-full bg-primary/5 dark:bg-primary/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${30 + (index * 15)}px`,
              height: `${30 + (index * 15)}px`,
            }}
            animate={{
              y: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
              x: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          style={{ opacity, y, scale }}
        >
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 py-2 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                    whileHover={{ 
                      y: -2,
                      backgroundColor: "rgba(var(--primary-rgb), 0.1)"
                    }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10">
                      {React.cloneElement(feature.icon, { className: "h-3.5 w-3.5 text-primary" })}
                    </div>
                    <span className="text-sm font-medium line-clamp-1">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="relative z-10">
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
            
            <motion.div 
              className="absolute -bottom-8 -right-8 w-2/3 h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-0 hidden lg:block"
              animate={{ 
                y: [5, -5, 5],
                rotate: [0, 1, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1, 
              }}
            >
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-20 bg-gray-100 dark:bg-gray-600 rounded"></div>
                  <div className="h-20 bg-gray-100 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -top-6 -left-6 w-16 h-16 bg-primary/20 dark:bg-primary/30 rounded-lg z-20 hidden lg:flex items-center justify-center"
              animate={{ 
                y: [-5, 5, -5],
                x: [5, -5, 5],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Zap className="h-8 w-8 text-primary" />
            </motion.div>
            
            <motion.div
              className="absolute top-1/2 -right-4 w-12 h-12 bg-orange-500/20 dark:bg-orange-500/30 rounded-full z-20 hidden lg:flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <ShieldCheck className="h-6 w-6 text-orange-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
