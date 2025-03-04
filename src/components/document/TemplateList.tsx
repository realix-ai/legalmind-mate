
import { motion } from 'framer-motion';
import DocumentTemplate from '@/components/DocumentTemplate';
import { Button } from '@/components/ui/button';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface TemplateListProps {
  templates: Template[];
  onSelectTemplate: (id: string) => void;
  onCreateBlank: () => void;
}

const TemplateList = ({ templates, onSelectTemplate, onCreateBlank }: TemplateListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-3xl md:text-4xl font-semibold mb-4 text-center"
      >
        Document Drafting
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-muted-foreground text-center mb-8"
      >
        Create a new document or select from our professional templates.
      </motion.p>
      
      <motion.div variants={itemVariants} className="mb-8">
        <Button 
          size="lg" 
          onClick={onCreateBlank}
          className="mx-auto block"
        >
          Create Blank Document
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-medium mb-4">Templates</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <DocumentTemplate
              key={template.id}
              title={template.title}
              description={template.description}
              category={template.category}
              onClick={() => onSelectTemplate(template.id)}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateList;
