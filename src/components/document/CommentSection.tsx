
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageCircle, Send, X, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDocumentComments } from '@/hooks/document/useDocumentComments';
import { toast } from 'sonner';

interface CommentSectionProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CommentSection = ({ documentId, isOpen, onClose }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  const { 
    comments, 
    addComment, 
    updateComment, 
    deleteComment, 
    loadComments 
  } = useDocumentComments(documentId);
  
  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, loadComments]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment(newComment.trim());
    setNewComment('');
  };
  
  const handleStartEditing = (id: string, text: string) => {
    setEditingCommentId(id);
    setEditText(text);
  };
  
  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    updateComment(id, editText.trim());
    setEditingCommentId(null);
    setEditText('');
  };
  
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="border-l border-border h-full flex flex-col bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <h3 className="font-medium">Comments</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to comment</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{comment.author.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm mt-2">{comment.text}</p>
                  
                  <div className="flex gap-2 mt-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleStartEditing(comment.id, comment.text)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
