
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X, Edit, Trash, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/hooks/document/useDocumentCollaboration';

interface CommentListProps {
  comments: Comment[];
  onResolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, text: string) => void;
}

const CommentList = ({ comments, onResolve, onDelete, onEdit }: CommentListProps) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState('');
  
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-primary/10 rounded-full p-4 mb-3">
          <MessageSquare className="h-6 w-6 text-primary/70" />
        </div>
        <h3 className="text-base font-medium mb-1">No comments yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation or provide feedback
        </p>
      </div>
    );
  }
  
  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };
  
  const handleSaveEdit = (commentId: string) => {
    onEdit(commentId, editText);
    setEditingId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {comments.map(comment => (
        <div 
          key={comment.id}
          className={`p-3 rounded-lg border ${comment.resolved ? 'bg-muted/30 border-muted' : 'bg-card border-border'}`}
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {comment.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                {comment.resolved && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs py-0 h-5">
                    <Check className="h-3 w-3" />
                    Resolved
                  </Badge>
                )}
              </div>
              
              {comment.position && (
                <div className="mt-1 p-2 bg-muted/50 rounded text-xs italic border-l-2 border-primary">
                  &ldquo;{comment.position.selectedText}&rdquo;
                </div>
              )}
              
              {editingId === comment.id ? (
                <div className="mt-2 space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleCancelEdit}
                      className="h-7 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveEdit(comment.id)}
                      className="h-7 px-2 text-xs"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className={`mt-1 text-sm ${comment.resolved ? 'text-muted-foreground' : ''}`}>
                  {comment.text}
                </p>
              )}
            </div>
          </div>
          
          {!editingId && (
            <div className="flex justify-end gap-1 mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onResolve(comment.id)}
                title={comment.resolved ? "Mark as unresolved" : "Mark as resolved"}
              >
                {comment.resolved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleStartEdit(comment)}
                title="Edit comment"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onDelete(comment.id)}
                title="Delete comment"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
