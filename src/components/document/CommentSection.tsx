
import React, { useState } from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDocumentCollaboration, Comment } from '@/hooks/document/useDocumentCollaboration';
import CommentList from './CommentList';
import CollaboratorsList from './CollaboratorsList';

interface CommentSectionProps {
  documentId: string | null;
}

const CommentSection = ({ documentId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const { 
    comments, 
    collaborators, 
    addComment, 
    updateComment, 
    deleteComment, 
    toggleCommentResolution,
    removeCollaborator
  } = useDocumentCollaboration(documentId);

  const handleAddComment = () => {
    if (newComment.trim() && documentId) {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="border rounded-md">
      <Tabs defaultValue="comments">
        <TabsList className="w-full border-b">
          <TabsTrigger value="comments" className="flex items-center gap-1 flex-1">
            <MessageSquare className="h-4 w-4" />
            Comments 
            <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
              {comments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="collaborators" className="flex items-center gap-1 flex-1">
            <Users className="h-4 w-4" />
            Collaborators
            <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
              {collaborators.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="p-4 space-y-4">
          <CommentList 
            comments={comments} 
            onResolve={toggleCommentResolution}
            onDelete={deleteComment}
            onEdit={updateComment}
          />
          
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 min-h-[80px]"
            />
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || !documentId}
              className="mb-[1px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="collaborators" className="p-4">
          <CollaboratorsList 
            collaborators={collaborators} 
            onRemoveCollaborator={removeCollaborator}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommentSection;
