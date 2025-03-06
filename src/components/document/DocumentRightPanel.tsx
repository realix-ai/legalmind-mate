
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Users, MessageCircle, ListChecks } from 'lucide-react';
import AddCollaborator from '@/components/document/AddCollaborator';
import CommentSection from '@/components/document/CommentSection';
import SectionCommentsList from '@/components/document/SectionCommentsList';
import ActiveEditorsList from '@/components/document/ActiveEditorsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRealtimeEditing } from '@/hooks/document/useRealtimeEditing';
import { useDocumentCollaboration } from '@/hooks/document/useDocumentCollaboration';

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
  const { editors } = useRealtimeEditing(documentId);
  const { comments } = useDocumentCollaboration(documentId);
  
  // Count of active editors
  const activeEditorsCount = editors.filter(editor => editor.isActive).length;
  
  // Count of unresolved comments
  const unresolvedCommentsCount = comments.filter(comment => !comment.resolved).length;
  
  return (
    <div className="w-1/3 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Collaboration</span>
            <Badge className="bg-primary/10 text-primary font-normal">
              {activeEditorsCount} active {activeEditorsCount === 1 ? 'editor' : 'editors'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <AddCollaborator 
            onAddCollaborator={onAddCollaborator}
            isLoading={isAddingCollaborator}
          />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="editors" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="editors" className="flex-1 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Editors
            {activeEditorsCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {activeEditorsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex-1 flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Comments
            {unresolvedCommentsCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {unresolvedCommentsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex-1 flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            Sections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editors" className="pt-4">
          <ActiveEditorsList documentId={documentId} />
        </TabsContent>
        
        <TabsContent value="comments" className="pt-4">
          <CommentSection documentId={documentId} />
        </TabsContent>
        
        <TabsContent value="sections" className="pt-4">
          <SectionCommentsList documentId={documentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentRightPanel;
