
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
import { ScrollArea } from "@/components/ui/scroll-area";

// Add template category to the document categories
const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'template', name: 'Template' },
  ...DOCUMENT_CATEGORIES
];

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
    if (category === 'template') return items.filter(item => !item.hasOwnProperty('lastModified')); // Template filter
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

      <motion.div variants={itemVariants} className="mb-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative mb-6">
            <ScrollArea className="w-full max-w-5xl mx-auto">
              <TabsList className="inline-flex w-full min-w-max h-auto p-1.5 bg-muted/10 border rounded-lg">
                {CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="rounded-md px-4 py-2 text-sm font-medium transition-all"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>
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
