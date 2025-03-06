
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

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
  color?: string; // For cursor/highlight colors
}

// Generate a distinct color for each editor
const EDITOR_COLORS = [
  '#8B5CF6', // Purple
  '#0EA5E9', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#14B8A6', // Teal
  '#6366F1', // Indigo
];

export function getEditorColor(id: string): string {
  // Use the editor ID to consistently get the same color
  const hashCode = id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const index = Math.abs(hashCode) % EDITOR_COLORS.length;
  return EDITOR_COLORS[index];
}

// Get editors for a document
export function getDocumentEditors(documentId: string | null): EditorPresence[] {
  if (!documentId) return [];
  
  const storedEditors = localStorage.getItem(`document_editors_${documentId}`);
  if (!storedEditors) return [];
  
  try {
    const parsedEditors = JSON.parse(storedEditors);
    
    // Filter out stale editors (inactive for more than 5 minutes)
    return parsedEditors.filter((editor: EditorPresence) => 
      Date.now() - editor.lastActive < 5 * 60 * 1000
    ).map((editor: EditorPresence) => ({
      ...editor,
      color: editor.color || getEditorColor(editor.id)
    }));
  } catch (error) {
    console.error('Error parsing stored editors:', error);
    return [];
  }
}

// Save editors for a document
export function saveDocumentEditors(documentId: string | null, editors: EditorPresence[]): void {
  if (!documentId) return;
  localStorage.setItem(`document_editors_${documentId}`, JSON.stringify(editors));
}

// Register as a new editor
export function registerEditor(documentId: string | null, name: string = 'You'): string | null {
  if (!documentId) return null;
  
  const editorId = uuidv4();
  const editors = getDocumentEditors(documentId);
  
  const newEditor: EditorPresence = {
    id: editorId,
    name,
    cursor: { position: 0 },
    lastActive: Date.now(),
    isActive: true,
    color: getEditorColor(editorId)
  };
  
  const updatedEditors = [...editors, newEditor];
  saveDocumentEditors(documentId, updatedEditors);
  
  return editorId;
}

// Unregister an editor
export function unregisterEditor(documentId: string | null, editorId: string | null): void {
  if (!documentId || !editorId) return;
  
  const editors = getDocumentEditors(documentId);
  const remainingEditors = editors.filter(editor => editor.id !== editorId);
  saveDocumentEditors(documentId, remainingEditors);
}

// Update an editor's presence
export function updateEditorPresence(
  documentId: string | null, 
  editorId: string | null,
  isActive: boolean,
  cursorPosition?: number,
  selection?: { start: number; end: number }
): void {
  if (!documentId || !editorId) return;
  
  const editors = getDocumentEditors(documentId);
  const updatedEditors = editors.map(editor => {
    if (editor.id === editorId) {
      return {
        ...editor,
        lastActive: Date.now(),
        isActive,
        cursor: {
          position: cursorPosition !== undefined ? cursorPosition : editor.cursor.position,
          selection: selection || editor.cursor.selection
        }
      };
    }
    return editor;
  });
  
  saveDocumentEditors(documentId, updatedEditors);
}

