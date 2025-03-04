
import { motion } from 'framer-motion';
import { Search, FileText, Briefcase, Zap, Shield, Clock } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
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

  const features = [
    {
      icon: Search,
      title: "Intelligent Query Assistant",
      description: "Ask legal questions and get comprehensive answers with options for legal research, risk analysis, summarization, and data analysis.",
      path: "/query-assistant"
    },
    {
      icon: FileText,
      title: "Document Drafting",
      description: "Create professional legal documents with AI assistance. Choose from templates or draft custom documents with intelligent suggestions.",
      path: "/document-drafting"
    },
    {
      icon: Briefcase,
      title: "Case Management",
      description: "Organize and track your cases with our intuitive management system. Set priorities, deadlines, and receive AI-powered insights.",
      path: "/case-management"
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: "AI-Powered Workflow",
      description: "Automate repetitive tasks and streamline your workflow with intelligent assistance that learns from your actions.",
      color: "amber"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols ensure your sensitive legal data remains private and protected.",
      color: "emerald"
    },
    {
      icon: Clock,
      title: "Time-Saving Tools",
      description: "Cut research and document preparation time by up to 70% with our specialized tools designed for legal professionals.",
      color: "blue"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium inline-block mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Designed for Legal Professionals
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our AI assistant offers specialized tools designed to enhance your legal practice and save you valuable time.
          </motion.p>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <FeatureCard 
              key={feature.path}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              path={feature.path}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            >
              <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
