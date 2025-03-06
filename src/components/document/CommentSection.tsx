
import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentCollaboration, Comment } from '@/hooks/document/useDocumentCollaboration';
import CommentList from './CommentList';

interface CommentSectionProps {
  documentId: string | null;
}

const CommentSection = ({ documentId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const { 
    comments, 
    addComment, 
    updateComment, 
    deleteComment, 
    toggleCommentResolution,
  } = useDocumentCollaboration(documentId);

  const handleAddComment = () => {
    if (newComment.trim() && documentId) {
      addComment(newComment);
      setNewComment('');
    }
  };

  // Count unresolved and resolved comments
  const unresolvedComments = comments.filter(comment => !comment.resolved);
  const resolvedComments = comments.filter(comment => comment.resolved);

  return (
    <div className="space-y-4">
      {/* Comment input */}
      <div className="border rounded-md p-3 bg-card">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim() || !documentId}
            className="mb-[1px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Tip: Press Ctrl+Enter to submit
        </p>
      </div>
      
      {/* Comments display */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {unresolvedComments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Open comments ({unresolvedComments.length})
              </h3>
              <CommentList 
                comments={unresolvedComments} 
                onResolve={toggleCommentResolution}
                onDelete={deleteComment}
                onEdit={updateComment}
              />
            </div>
          )}
          
          {resolvedComments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Resolved comments ({resolvedComments.length})
              </h3>
              <CommentList 
                comments={resolvedComments} 
                onResolve={toggleCommentResolution}
                onDelete={deleteComment}
                onEdit={updateComment}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-primary/10 rounded-full p-4 mb-3">
            <MessageSquare className="h-6 w-6 text-primary/70" />
          </div>
          <h3 className="text-base font-medium mb-1">No comments yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation or provide feedback
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
