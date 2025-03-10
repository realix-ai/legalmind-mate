
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Search, BookOpen, FileText, Bookmark, AlertTriangle, BarChart } from 'lucide-react';

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
            <div className="mx-auto font-medium text-sm">Works Wise - Legal Assistant</div>
          </div>
          <div className="p-6">
            {/* Tab navigation for different features */}
            <div className="flex items-center space-x-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="px-3 py-1.5 bg-primary text-white rounded-t-lg text-sm font-medium flex items-center">
                <Search className="h-3.5 w-3.5 mr-1.5" />
                <span>Legal Research</span>
              </div>
              <div className="px-3 py-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                <span>Risk Analysis</span>
              </div>
              <div className="px-3 py-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                <span>Drafting</span>
              </div>
            </div>

            {/* Legal Research Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-40 bg-primary/10 rounded flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Case Law Search</span>
                </div>
                <div className="h-8 w-24 bg-orange-500/10 rounded flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Citations</span>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium text-sm">Smith v. Johnson (2023)</span>
                </div>
                <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Case precedent */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Bookmark className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="font-medium text-sm">Precedent Analysis</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                
                {/* Risk assessment */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="font-medium text-sm">Risk Factors</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              
              {/* Data analysis section */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <BarChart className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="font-medium text-sm">Statistical Analysis</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-4 bg-primary rounded-t"></div>
                    <span className="text-xs mt-1">2019</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-4 bg-primary rounded-t"></div>
                    <span className="text-xs mt-1">2020</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-20 w-4 bg-primary rounded-t"></div>
                    <span className="text-xs mt-1">2021</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-4 bg-primary rounded-t"></div>
                    <span className="text-xs mt-1">2022</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-4 bg-primary rounded-t"></div>
                    <span className="text-xs mt-1">2023</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <div className="h-4 w-full bg-white dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400 flex items-center px-2">Search legal precedents...</div>
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-green-500 mr-2" />
              <div className="text-sm font-medium">Document Drafting</div>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="h-20 bg-green-500/5 dark:bg-gray-600 rounded p-2">
              <div className="flex items-center mb-2">
                <FileText className="h-3 w-3 text-green-500 mr-1" />
                <div className="text-xs font-medium">Contract Template</div>
              </div>
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-500 rounded mb-1"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-500 rounded mb-1"></div>
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-500 rounded"></div>
            </div>
            <div className="h-20 bg-amber-500/5 dark:bg-gray-600 rounded p-2">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                <div className="text-xs font-medium">Risk Assessment</div>
              </div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-500 rounded mb-1"></div>
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-500 rounded mb-1"></div>
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-500 rounded"></div>
            </div>
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
        <BookOpen className="h-8 w-8 text-primary" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 -right-4 w-12 h-12 bg-amber-500/20 dark:bg-amber-500/30 rounded-full z-20 hidden lg:flex items-center justify-center"
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
        <AlertTriangle className="h-6 w-6 text-amber-500" />
      </motion.div>
    </motion.div>
  );
};

export default HeroVisual;
