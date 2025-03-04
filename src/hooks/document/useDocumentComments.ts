
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export type Comment = {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: number;
  documentId: string;
};

// Simulate a current user
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  avatar: '/placeholder.svg'
};

export const useDocumentComments = (documentId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  
  const loadComments = useCallback(() => {
    const stored = localStorage.getItem(`document_comments_${documentId}`);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing comments:', e);
        setComments([]);
      }
    }
  }, [documentId]);
  
  const saveComments = useCallback((updatedComments: Comment[]) => {
    localStorage.setItem(
      `document_comments_${documentId}`, 
      JSON.stringify(updatedComments)
    );
    setComments(updatedComments);
  }, [documentId]);
  
  const addComment = useCallback((text: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      text,
      author: currentUser,
      timestamp: Date.now(),
      documentId
    };
    
    const updatedComments = [...comments, newComment];
    saveComments(updatedComments);
    toast.success('Comment added');
    
    // In a real application, you would send this to an API
    console.log('Added comment:', newComment);
  }, [comments, documentId, saveComments]);
  
  const updateComment = useCallback((commentId: string, text: string) => {
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, text, timestamp: Date.now() } 
        : comment
    );
    
    saveComments(updatedComments);
    toast.success('Comment updated');
    
    // In a real application, you would send this to an API
    console.log('Updated comment:', commentId, text);
  }, [comments, saveComments]);
  
  const deleteComment = useCallback((commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    saveComments(updatedComments);
    toast.success('Comment deleted');
    
    // In a real application, you would send this to an API
    console.log('Deleted comment:', commentId);
  }, [comments, saveComments]);
  
  return {
    comments,
    addComment,
    updateComment,
    deleteComment,
    loadComments
  };
};
