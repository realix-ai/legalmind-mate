
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from './useDocumentCollaboration';

export interface SectionComment extends Comment {
  sectionId: string;
  sectionName: string;
}

export function useSectionComments(documentId: string | null) {
  const [sectionComments, setSectionComments] = useState<SectionComment[]>([]);

  // Load comments
  useEffect(() => {
    if (documentId) {
      const storedComments = localStorage.getItem(`document_section_comments_${documentId}`);
      if (storedComments) {
        try {
          setSectionComments(JSON.parse(storedComments));
        } catch (error) {
          console.error('Error parsing stored section comments:', error);
          setSectionComments([]);
        }
      }
    }
  }, [documentId]);

  // Save comments
  const saveComments = (newComments: SectionComment[]) => {
    if (documentId) {
      localStorage.setItem(`document_section_comments_${documentId}`, JSON.stringify(newComments));
    }
  };

  // Add comment to a specific section
  const addSectionComment = (text: string, sectionId: string, sectionName: string) => {
    if (!documentId) return null;

    const newComment: SectionComment = {
      id: uuidv4(),
      documentId,
      sectionId,
      sectionName,
      author: 'You',
      text,
      timestamp: Date.now(),
      resolved: false
    };

    const updatedComments = [...sectionComments, newComment];
    setSectionComments(updatedComments);
    saveComments(updatedComments);
    toast.success(`Comment added to section: ${sectionName}`);

    return newComment;
  };

  // Get comments for a specific section
  const getCommentsForSection = (sectionId: string) => {
    return sectionComments.filter(comment => comment.sectionId === sectionId);
  };

  // Update section comment
  const updateSectionComment = (commentId: string, text: string) => {
    const updatedComments = sectionComments.map(comment =>
      comment.id === commentId ? { ...comment, text } : comment
    );

    setSectionComments(updatedComments);
    saveComments(updatedComments);
    toast.success('Comment updated');
  };

  // Delete section comment
  const deleteSectionComment = (commentId: string) => {
    const updatedComments = sectionComments.filter(comment => comment.id !== commentId);
    setSectionComments(updatedComments);
    saveComments(updatedComments);
    toast.success('Comment deleted');
  };

  // Resolve/unresolve comment
  const toggleSectionCommentResolution = (commentId: string) => {
    const updatedComments = sectionComments.map(comment =>
      comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment
    );

    setSectionComments(updatedComments);
    saveComments(updatedComments);

    const comment = sectionComments.find(c => c.id === commentId);
    toast.success(`Comment ${comment?.resolved ? 'unresolved' : 'resolved'}`);
  };

  return {
    sectionComments,
    addSectionComment,
    getCommentsForSection,
    updateSectionComment,
    deleteSectionComment,
    toggleSectionCommentResolution
  };
}
