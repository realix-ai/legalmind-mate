
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface DocumentsPanelProps {
  caseNumber: string;
  caseName: string;
  documents: Document[];
}

const DocumentsPanel = ({ caseNumber, caseName, documents }: DocumentsPanelProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-1 bg-card rounded-lg shadow-md p-6 max-h-[calc(100vh-160px)] overflow-auto"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <p className="text-muted-foreground text-sm">Case: {caseNumber}</p>
        </div>
      </div>
      
      {documents.length > 0 ? (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between p-3 rounded-md border hover:border-primary/50 transition-colors duration-200">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">{doc.date}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(`/document-drafting/edit/${doc.id}`)}
                className="hover:bg-primary/5"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-primary/10 rounded-full p-4 mb-3">
            <FileText className="h-8 w-8 text-primary/70" />
          </div>
          <h3 className="text-lg font-medium mb-1">No documents yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a document and assign it to this case
          </p>
          <Button onClick={() => navigate('/document-drafting')}>
            Create Document
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentsPanel;
