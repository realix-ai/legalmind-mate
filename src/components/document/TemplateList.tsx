
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

  // Function to determine category color
  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'contract': return 'bg-blue-100 hover:bg-blue-200 text-blue-700 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800';
      case 'letter': return 'bg-green-100 hover:bg-green-200 text-green-700 data-[state=active]:bg-green-200 data-[state=active]:text-green-800';
      case 'memo': return 'bg-amber-100 hover:bg-amber-200 text-amber-700 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800';
      case 'pleading': return 'bg-purple-100 hover:bg-purple-200 text-purple-700 data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800';
      case 'brief': return 'bg-pink-100 hover:bg-pink-200 text-pink-700 data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800';
      case 'research': return 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 data-[state=active]:bg-cyan-200 data-[state=active]:text-cyan-800';
      case 'notes': return 'bg-orange-100 hover:bg-orange-200 text-orange-700 data-[state=active]:bg-orange-200 data-[state=active]:text-orange-800';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-700 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-800';
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
            <div className="absolute inset-0 bg-gradient-to-r from-background via-muted/30 to-background pointer-events-none z-10 hidden md:block" />
            <ScrollArea className="w-full max-w-5xl mx-auto">
              <TabsList className="inline-flex w-full min-w-max h-auto p-1.5 bg-muted/20 backdrop-blur-sm border rounded-xl shadow-sm">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:shadow"
                >
                  All Categories
                </TabsTrigger>
                
                {DOCUMENT_CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${getCategoryColor(category.id)}`}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-muted"></div>
            <p className="text-sm font-medium text-muted-foreground px-4">
              {activeTab === 'all' ? 'All Categories' : DOCUMENT_CATEGORIES.find(c => c.id === activeTab)?.name || 'Category'}
            </p>
            <div className="h-px flex-1 bg-muted"></div>
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
