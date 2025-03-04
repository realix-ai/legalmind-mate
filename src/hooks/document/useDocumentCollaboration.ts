
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface Comment {
  id: string;
  documentId: string;
  author: string;
  text: string;
  timestamp: number;
  position?: {
    startOffset: number;
    endOffset: number;
    selectedText: string;
  };
  resolved: boolean;
}

export interface CollaboratorStatus {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  lastActive: number;
}

export const useDocumentCollaboration = (documentId: string | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorStatus[]>([]);
  
  // Simulated collaborators
  useEffect(() => {
    if (documentId) {
      setCollaborators([
        { id: '1', name: 'Sarah Johnson', status: 'online', lastActive: Date.now() },
        { id: '2', name: 'Mark Williams', status: 'away', lastActive: Date.now() - 300000 },
        { id: '3', name: 'Alice Chen', status: 'offline', lastActive: Date.now() - 3600000 }
      ]);
    }
  }, [documentId]);
  
  // Load comments
  useEffect(() => {
    if (documentId) {
      const storedComments = localStorage.getItem(`document_comments_${documentId}`);
      if (storedComments) {
        try {
          setComments(JSON.parse(storedComments));
        } catch (error) {
          console.error('Error parsing stored comments:', error);
          setComments([]);
        }
      }
    }
  }, [documentId]);
  
  // Save comments
  const saveComments = (newComments: Comment[]) => {
    if (documentId) {
      localStorage.setItem(`document_comments_${documentId}`, JSON.stringify(newComments));
    }
  };
  
  // Add comment
  const addComment = (text: string, position?: Comment['position']) => {
    if (!documentId) return null;
    
    const newComment: Comment = {
      id: uuidv4(),
      documentId,
      author: 'You',
      text,
      timestamp: Date.now(),
      position,
      resolved: false
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveComments(updatedComments);
    toast.success('Comment added');
    
    return newComment;
  };
  
  // Update comment
  const updateComment = (commentId: string, text: string) => {
    const updatedComments = comments.map(comment => 
      comment.id === commentId ? { ...comment, text } : comment
    );
    
    setComments(updatedComments);
    saveComments(updatedComments);
    toast.success('Comment updated');
  };
  
  // Delete comment
  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    saveComments(updatedComments);
    toast.success('Comment deleted');
  };
  
  // Resolve/unresolve comment
  const toggleCommentResolution = (commentId: string) => {
    const updatedComments = comments.map(comment => 
      comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment
    );
    
    setComments(updatedComments);
    saveComments(updatedComments);
    
    const comment = comments.find(c => c.id === commentId);
    toast.success(`Comment ${comment?.resolved ? 'unresolved' : 'resolved'}`);
  };
  
  return {
    comments,
    collaborators,
    addComment,
    updateComment,
    deleteComment,
    toggleCommentResolution
  };
};
