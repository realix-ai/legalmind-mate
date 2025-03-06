import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  EditorPresence,
  getDocumentEditors,
  registerEditor,
  unregisterEditor,
  updateEditorPresence
} from '@/services/collaboration/realtimeService';

export function useRealtimeEditing(documentId: string | null) {
  const [editors, setEditors] = useState<EditorPresence[]>([]);
  const [currentEditor, setCurrentEditor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize editors and current editor
  useEffect(() => {
    if (!documentId) return;

    // Load active editors
    const loadedEditors = getDocumentEditors(documentId);
    setEditors(loadedEditors);
    
    // Register current user as an editor
    const editorId = registerEditor(documentId);
    setCurrentEditor(editorId);

    // Set up interval to refresh editors list
    const interval = setInterval(() => {
      setEditors(getDocumentEditors(documentId));
    }, 10000); // Refresh every 10 seconds
    
    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      if (documentId && currentEditor) {
        unregisterEditor(documentId, currentEditor);
      }
    };
  }, [documentId]);

  // Update editor cursor position
  const updateCursorPosition = (position: number, selection?: { start: number; end: number }) => {
    if (!documentId || !currentEditor) return;
    
    updateEditorPresence(documentId, currentEditor, isEditing, position, selection);
    
    // Update local editors list
    setEditors(getDocumentEditors(documentId));
  };

  // Begin editing
  const beginEditing = () => {
    if (!documentId || !currentEditor) return;
    
    setIsEditing(true);
    updateEditorPresence(documentId, currentEditor, true);
    
    // Update local editors list
    setEditors(getDocumentEditors(documentId));
  };

  // End editing
  const endEditing = () => {
    if (!documentId || !currentEditor) return;
    
    setIsEditing(false);
    updateEditorPresence(documentId, currentEditor, false);
    
    // Update local editors list
    setEditors(getDocumentEditors(documentId));
  };

  // Heartbeat to keep editor presence active
  useEffect(() => {
    if (!documentId || !currentEditor) return;

    const interval = setInterval(() => {
      updateEditorPresence(documentId, currentEditor, isEditing);
      setEditors(getDocumentEditors(documentId));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [documentId, currentEditor, isEditing]);

  return {
    editors,
    currentEditor,
    isEditing,
    updateCursorPosition,
    beginEditing,
    endEditing
  };
}
