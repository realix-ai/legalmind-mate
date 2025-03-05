
import { motion } from 'framer-motion';
import DocumentTemplate from '@/components/DocumentTemplate';
import { Button } from '@/components/ui/button';
import TemplateUploadDialog from './TemplateUploadDialog';
import { getSavedDocuments } from '@/utils/documents';
import { useEffect, useState } from 'react';
import { SavedDocument, CustomTemplate } from '@/utils/documents/types';
import { templates } from '@/utils/documents/templateData';
import { getCustomTemplates } from '@/utils/documents/templateManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DOCUMENT_CATEGORIES } from './DocumentCategories';

interface TemplateListProps {
  onSelectTemplate: (id: string) => void;
}

const TemplateList = ({ onSelectTemplate }: TemplateListProps) => {
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Load saved documents
    setSavedDocuments(getSavedDocuments());
    
    // Load custom templates
    setCustomTemplates(getCustomTemplates());
  }, []);
  
  const handleCreateBlank = () => {
    // Create a blank document with default title and empty content
    onSelectTemplate('blank');
  };
  
  const handleTemplateAdded = () => {
    // Refresh templates
    setCustomTemplates(getCustomTemplates());
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

  // Filter documents by category
  const filterByCategory = (items: any[], category: string) => {
    if (category === 'all') return items;
    return items.filter(item => 
      (item.category || 'general').toLowerCase() === category.toLowerCase()
    );
  };

  // Get documents for current tab
  const filteredDocuments = filterByCategory(savedDocuments, activeTab);
  const filteredTemplates = filterByCategory([...customTemplates, ...templates], activeTab);

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

      <motion.div variants={itemVariants} className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-lg mx-auto grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="contract">Contracts</TabsTrigger>
            <TabsTrigger value="pleading">Pleadings</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
      
      {filteredDocuments.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-medium mb-4">Your Documents</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredDocuments.map((doc) => (
              <DocumentTemplate
                key={doc.id}
                title={doc.title}
                description={`Last modified: ${new Date(doc.lastModified).toLocaleDateString()}`}
                category={doc.category ? DOCUMENT_CATEGORIES.find(c => c.id === doc.category)?.name || doc.category : 'General'}
                onClick={() => onSelectTemplate(doc.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {filteredTemplates.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-medium mb-4">Templates</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredTemplates.map((template) => (
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
    </motion.div>
  );
};

export default TemplateList;
