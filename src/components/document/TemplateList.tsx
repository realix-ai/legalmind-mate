import { motion } from 'framer-motion';
import DocumentTemplate from '@/components/DocumentTemplate';
import { Button } from '@/components/ui/button';
import TemplateUploadDialog from './TemplateUploadDialog';
import { getSavedDocuments } from '@/utils/documents';
import { useEffect, useState } from 'react';
import { SavedDocument, CustomTemplate } from '@/utils/documents/types';

interface TemplateListProps {
  onSelectTemplate: (id: string) => void;
}

const TemplateList = ({ onSelectTemplate }: TemplateListProps) => {
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  
  useEffect(() => {
    // Load saved documents
    setSavedDocuments(getSavedDocuments());
    
    // Load custom templates (mock data for now)
    setCustomTemplates([
      {
        id: 'template-1',
        title: 'Legal Memorandum',
        description: 'Standard legal memorandum template',
        content: 'MEMORANDUM\n\nTO: [Recipient]\nFROM: [Sender]\nDATE: [Date]\nSUBJECT: [Subject]\n\n1. ISSUE\n\n2. BRIEF ANSWER\n\n3. FACTS\n\n4. DISCUSSION\n\n5. CONCLUSION',
        category: 'Legal Writing',
        createdAt: Date.now()
      },
      {
        id: 'template-2',
        title: 'Contract Agreement',
        description: 'Basic contract template',
        content: 'CONTRACT AGREEMENT\n\nThis Agreement is made and entered into on [DATE] by and between:\n\n[PARTY A], with address at [ADDRESS], referred to as "Party A"\n\nand\n\n[PARTY B], with address at [ADDRESS], referred to as "Party B"\n\n1. SCOPE OF WORK\n\n2. PAYMENT\n\n3. TERM AND TERMINATION\n\n4. CONFIDENTIALITY\n\n5. GOVERNING LAW',
        category: 'Contracts',
        createdAt: Date.now()
      }
    ]);
  }, []);
  
  const handleCreateBlank = () => {
    // Create a blank document with default title and empty content
    const blankDocTitle = "Untitled Document";
    const blankDocContent = "";
    onSelectTemplate('blank');
  };
  
  const handleTemplateAdded = () => {
    // Refresh templates
    // This would normally call an API or load from storage
  };
  
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

  // Mock template data
  const templates = [
    {
      id: 'template-3',
      title: 'Motion to Dismiss',
      description: 'Standard motion to dismiss template',
      category: 'Litigation'
    },
    {
      id: 'template-4',
      title: 'Settlement Agreement',
      description: 'Comprehensive settlement template',
      category: 'Dispute Resolution'
    },
    {
      id: 'template-5',
      title: 'Legal Brief',
      description: 'Template for court briefs',
      category: 'Legal Writing'
    },
    {
      id: 'template-6',
      title: 'Client Intake Form',
      description: 'New client information form',
      category: 'Client Management'
    }
  ];

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
      
      <motion.div variants={itemVariants} className="mb-8 flex gap-4 justify-center">
        <Button 
          size="lg" 
          onClick={handleCreateBlank}
        >
          Create Blank Document
        </Button>
        
        <TemplateUploadDialog onTemplateAdded={handleTemplateAdded} />
      </motion.div>

      {savedDocuments.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-medium mb-4">Your Documents</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {savedDocuments.map((doc) => (
              <DocumentTemplate
                key={doc.id}
                title={doc.title}
                description={`Last modified: ${new Date(doc.lastModified).toLocaleDateString()}`}
                category="Your Document"
                onClick={() => onSelectTemplate(doc.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {customTemplates.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-medium mb-4">Your Templates</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {customTemplates.map((template) => (
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
      )}
      
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
