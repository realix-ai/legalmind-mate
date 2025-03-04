
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search,
  FileText,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-secondary/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Powerful Features for Legal Professionals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI assistant offers specialized tools designed to enhance your legal practice and save you valuable time.
            </p>
          </div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-subtle border transition-all duration-300 hover:shadow-elevated hover:border-primary/30"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Intelligent Query Assistant</h3>
              <p className="text-muted-foreground">
                Ask legal questions and get comprehensive answers with options for legal research, risk analysis, summarization, and data analysis.
              </p>
              <Button 
                variant="ghost" 
                className="mt-4 gap-2"
                onClick={() => navigate('/query-assistant')}
              >
                Try it now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-subtle border transition-all duration-300 hover:shadow-elevated hover:border-primary/30"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Document Drafting</h3>
              <p className="text-muted-foreground">
                Create professional legal documents with AI assistance. Choose from templates or draft custom documents with intelligent suggestions.
              </p>
              <Button 
                variant="ghost" 
                className="mt-4 gap-2"
                onClick={() => navigate('/document-drafting')}
              >
                Try it now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-subtle border transition-all duration-300 hover:shadow-elevated hover:border-primary/30"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Case Management</h3>
              <p className="text-muted-foreground">
                Organize and track your cases with our intuitive management system. Set priorities, deadlines, and receive AI-powered insights.
              </p>
              <Button 
                variant="ghost" 
                className="mt-4 gap-2"
                onClick={() => navigate('/case-management')}
              >
                Try it now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 relative z-10">Ready to transform your legal practice?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
              Join thousands of legal professionals who are saving time and improving outcomes with our AI assistant.
            </p>
            
            <Button 
              size="lg" 
              className="gap-2 relative z-10"
              onClick={() => navigate('/query-assistant')}
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-medium text-lg">R</span>
              </div>
              <span className="font-medium text-xl">Realix.ai</span>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Realix.ai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
