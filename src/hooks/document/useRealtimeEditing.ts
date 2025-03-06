import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface EditorPresence {
  id: string;
  name: string;
  cursor: {
    position: number;
    selection?: {
      start: number;
      end: number;
    };
  };
  lastActive: number;
  isActive?: boolean;
}

export function useRealtimeEditing(documentId: string | null) {
  const [editors, setEditors] = useState<EditorPresence[]>([]);
  const [currentEditor, setCurrentEditor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize editors
  useEffect(() => {
    if (!documentId) return;

    // Load active editors from localStorage
    const storedEditors = localStorage.getItem(`document_editors_${documentId}`);
    if (storedEditors) {
      try {
        const parsedEditors = JSON.parse(storedEditors);
        
        // Filter out stale editors (inactive for more than 5 minutes)
        const activeEditors = parsedEditors.filter((editor: EditorPresence) => 
          Date.now() - editor.lastActive < 5 * 60 * 1000
        );
        
        setEditors(activeEditors);
      } catch (error) {
        console.error('Error parsing stored editors:', error);
        setEditors([]);
      }
    } else {
      setEditors([]);
    }

    // Create a unique ID for the current editor
    const editorId = uuidv4();
    setCurrentEditor(editorId);

    // Add current user as an editor
    const newEditor: EditorPresence = {
      id: editorId,
      name: 'You',
      cursor: {
        position: 0
      },
      lastActive: Date.now(),
      isActive: true // Set the current user as active
    };

    setEditors(prevEditors => {
      const updatedEditors = [...prevEditors, newEditor];
      localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(updatedEditors));
      return updatedEditors;
    });

    // Cleanup on unmount
    return () => {
      if (documentId && currentEditor) {
        // Remove current editor when leaving
        setEditors(prevEditors => {
          const remainingEditors = prevEditors.filter(editor => editor.id !== editorId);
          localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(remainingEditors));
          return remainingEditors;
        });
      }
    };
  }, [documentId]);

  // Update editor cursor position
  const updateCursorPosition = (position: number, selection?: { start: number; end: number }) => {
    if (!documentId || !currentEditor) return;

    setEditors(prevEditors => {
      const updatedEditors = prevEditors.map(editor => {
        if (editor.id === currentEditor) {
          return {
            ...editor,
            cursor: {
              position,
              selection
            },
            lastActive: Date.now(),
            isActive: true // Set this editor as active when updating cursor
          };
        }
        return editor;
      });

      localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(updatedEditors));
      return updatedEditors;
    });
  };

  // Begin editing
  const beginEditing = () => {
    if (!documentId || !currentEditor) return;

    // Update status to editing
    setIsEditing(true);
    
    // Update last active timestamp
    setEditors(prevEditors => {
      const updatedEditors = prevEditors.map(editor => {
        if (editor.id === currentEditor) {
          return {
            ...editor,
            lastActive: Date.now(),
            isActive: true // Set this editor as active when beginning editing
          };
        }
        return editor;
      });

      localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(updatedEditors));
      return updatedEditors;
    });
  };

  // End editing
  const endEditing = () => {
    setIsEditing(false);
    
    // Update editor status to inactive
    if (documentId && currentEditor) {
      setEditors(prevEditors => {
        const updatedEditors = prevEditors.map(editor => {
          if (editor.id === currentEditor) {
            return {
              ...editor,
              isActive: false // Set this editor as inactive when ending editing
            };
          }
          return editor;
        });

        localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(updatedEditors));
        return updatedEditors;
      });
    }
  };

  // Heartbeat to keep editor presence active
  useEffect(() => {
    if (!documentId || !currentEditor) return;

    const interval = setInterval(() => {
      setEditors(prevEditors => {
        const updatedEditors = prevEditors.map(editor => {
          if (editor.id === currentEditor) {
            return {
              ...editor,
              lastActive: Date.now(),
              isActive: isEditing // Set active status based on current editing state
            };
          }
          return editor;
        });

        localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(updatedEditors));
        return updatedEditors;
      });
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
