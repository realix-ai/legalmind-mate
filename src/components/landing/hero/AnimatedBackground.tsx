
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const numWaves = 3;
  const waves = Array.from({ length: numWaves });
  
  const numCircles = 8;
  const circles = Array.from({ length: numCircles });

  return (
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
  );
};

export default AnimatedBackground;
