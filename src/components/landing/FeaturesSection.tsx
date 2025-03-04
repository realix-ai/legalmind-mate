
import { motion } from 'framer-motion';
import { Search, FileText, Briefcase } from 'lucide-react';
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

  return (
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
      </div>
    </section>
  );
};

export default FeaturesSection;
