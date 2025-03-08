
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Search } from 'lucide-react';

const HeroVisual = () => {
  return (
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
  );
};

export default HeroVisual;
