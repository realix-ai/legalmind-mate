
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSectionComments } from '@/hooks/document/useSectionComments';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X, Edit, Trash, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Disclosure, DisclosureContent, DisclosureTrigger } from '@components/ui/disclosure';

interface SectionCommentsListProps {
  documentId: string | null;
}

const SectionCommentsList = ({ documentId }: SectionCommentsListProps) => {
  const {
    sectionComments,
    updateSectionComment,
    deleteSectionComment,
    toggleSectionCommentResolution
  } = useSectionComments(documentId);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  // Group comments by section
  const groupedComments = sectionComments.reduce((acc, comment) => {
    if (!acc[comment.sectionId]) {
      acc[comment.sectionId] = {
        sectionName: comment.sectionName,
        comments: []
      };
    }
    acc[comment.sectionId].comments.push(comment);
    return acc;
  }, {} as Record<string, { sectionName: string, comments: typeof sectionComments }>);
  
  const handleStartEdit = (comment: (typeof sectionComments)[0]) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };
  
  const handleSaveEdit = (commentId: string) => {
    updateSectionComment(commentId, editText);
    setEditingId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  if (Object.keys(groupedComments).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-primary/10 rounded-full p-4 mb-3">
          <MessageSquare className="h-6 w-6 text-primary/70" />
        </div>
        <h3 className="text-base font-medium mb-1">No section comments yet</h3>
        <p className="text-sm text-muted-foreground">
          Add comments to specific sections of your document
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {Object.entries(groupedComments).map(([sectionId, { sectionName, comments }]) => (
          <div key={sectionId} className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-3 py-2 border-b">
              <h3 className="text-sm font-medium flex items-center">
                <span className="truncate">{sectionName}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {comments.length}
                </Badge>
              </h3>
            </div>
            
            <div className="p-3 space-y-3">
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
                        onClick={() => toggleSectionCommentResolution(comment.id)}
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
                        onClick={() => deleteSectionComment(comment.id)}
                        title="Delete comment"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SectionCommentsList;
