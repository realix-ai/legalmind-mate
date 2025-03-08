
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedBackground from './hero/AnimatedBackground';
import HeroContent from './hero/HeroContent';
import HeroVisual from './hero/HeroVisual';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden px-4 py-20"
    >
      <AnimatedBackground />
      
      <div className="container max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          style={{ opacity, y, scale }}
        >
          <HeroContent />
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
