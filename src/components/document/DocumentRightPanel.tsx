
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Users } from 'lucide-react';
import AddCollaborator from '@/components/document/AddCollaborator';
import CommentSection from '@/components/document/CommentSection';
import SectionCommentsList from '@/components/document/SectionCommentsList';

interface DocumentRightPanelProps {
  documentId: string | null;
  isAddingCollaborator: boolean;
  onAddCollaborator: (email: string) => void;
}

const DocumentRightPanel = ({ 
  documentId, 
  isAddingCollaborator, 
  onAddCollaborator 
}: DocumentRightPanelProps) => {
  return (
    <div className="w-1/3 space-y-6">
      <AddCollaborator 
        onAddCollaborator={onAddCollaborator}
        isLoading={isAddingCollaborator}
      />
      
      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="comments" className="flex-1 flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="section-comments" className="flex-1 flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            By Section
          </TabsTrigger>
          <TabsTrigger value="collaborators" className="flex-1 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Editors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comments">
          <CommentSection documentId={documentId} />
        </TabsContent>
        
        <TabsContent value="section-comments">
          <SectionCommentsList documentId={documentId} />
        </TabsContent>
        
        <TabsContent value="collaborators">
          <ActiveEditorsList documentId={documentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentRightPanel;
