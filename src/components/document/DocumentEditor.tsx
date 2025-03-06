
import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  List,
  Users,
  MessageSquare,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRealtimeEditing, EditorPresence } from '@/hooks/document/useRealtimeEditing';
import { SectionCommentDialog } from './SectionCommentDialog';
import { useSectionComments } from '@/hooks/document/useSectionComments';
import { DocumentSection } from '@/utils/documents/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentEditorProps {
  documentContent: string;
  setDocumentContent: (content: string) => void;
  documentId: string | null;
}

const DocumentEditor = ({ 
  documentContent, 
  setDocumentContent,
  documentId
}: DocumentEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [selectedSection, setSelectedSection] = useState<DocumentSection | null>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Initialize real-time editing hooks
  const { 
    editors, 
    updateCursorPosition, 
    beginEditing, 
    endEditing,
    isEditing
  } = useRealtimeEditing(documentId);

  // Initialize section comments hook
  const {
    getCommentsForSection,
    addSectionComment
  } = useSectionComments(documentId);

  // Parse sections from content
  useEffect(() => {
    // Simple section detection (e.g., headings or manually marked sections)
    const parsedSections: DocumentSection[] = [];
    const lines = documentContent.split('\n');
    
    lines.forEach((line, index) => {
      // Detect headings (e.g., # Heading, ## Subheading)
      if (line.startsWith('#')) {
        const level = line.indexOf(' ');
        if (level > 0) {
          const title = line.substring(level).trim();
          const sectionId = `section-${index}`;
          const startPosition = documentContent.indexOf(line);
          
          // Find the end of this section (next heading or end of document)
          let endPosition = documentContent.length;
          for (let i = index + 1; i < lines.length; i++) {
            if (lines[i].startsWith('#')) {
              endPosition = documentContent.indexOf(lines[i]);
              break;
            }
          }
          
          parsedSections.push({
            id: sectionId,
            title,
            level,
            startPosition,
            endPosition,
            content: documentContent.substring(startPosition, endPosition)
          });
        }
      }
    });
    
    setSections(parsedSections);
  }, [documentContent]);

  // Keyboard shortcut handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if Ctrl/Cmd key is pressed
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': // Bold
          e.preventDefault();
          applyStyle('bold');
          break;
        case 'i': // Italic
          e.preventDefault();
          applyStyle('italic');
          break;
        case '1': // Heading 1
          e.preventDefault();
          applyStyle('h1');
          break;
        case '2': // Heading 2
          e.preventDefault();
          applyStyle('h2');
          break;
        case '3': // Heading 3
          e.preventDefault();
          applyStyle('h3');
          break;
        case 'k': // Show keyboard shortcuts
          e.preventDefault();
          setShowKeyboardShortcuts(prev => !prev);
          break;
        case '/': // Show comment dialog
          e.preventDefault();
          if (selectedSection) {
            setShowCommentDialog(true);
          } else {
            toast.info('Select a section first to add a comment');
          }
          break;
      }
    }
  }, [selectedSection]);

  // Handle editor events
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentContent(e.target.value);
    
    // Update cursor position for real-time collaboration
    const cursorPosition = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    
    if (selectionEnd !== cursorPosition) {
      updateCursorPosition(cursorPosition, { start: cursorPosition, end: selectionEnd });
    } else {
      updateCursorPosition(cursorPosition);
    }
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const editor = e.currentTarget;
    const cursorPosition = editor.selectionStart;
    
    // Find if user clicked in a specific section
    const clickedSection = sections.find(
      section => cursorPosition >= section.startPosition && cursorPosition <= section.endPosition
    );
    
    if (clickedSection) {
      setSelectedSection(clickedSection);
    } else {
      setSelectedSection(null);
    }
    
    // Update cursor position
    updateCursorPosition(cursorPosition);
  };

  const handleAddComment = () => {
    if (selectedSection) {
      setShowCommentDialog(true);
    } else {
      toast.error('Please select a section to comment on');
    }
  };

  const handleCommentSubmit = (comment: string) => {
    if (selectedSection) {
      addSectionComment(comment, selectedSection.id, selectedSection.title);
      setShowCommentDialog(false);
    }
  };

  // Style and formatting handlers
  const applyStyle = (style: string) => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = documentContent.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = end;
    
    switch(style) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = start + formattedText.length;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        newCursorPos = start + formattedText.length;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        newCursorPos = start + formattedText.length;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        newCursorPos = start + formattedText.length;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        newCursorPos = start + formattedText.length;
        break;
      default:
        return;
    }
    
    const newContent = 
      documentContent.substring(0, start) + 
      formattedText + 
      documentContent.substring(end);
    
    setDocumentContent(newContent);
    
    // Reset cursor position
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(newCursorPos, newCursorPos);
      updateCursorPosition(newCursorPos);
    }, 0);
  };

  // Display other editors' cursors
  const renderEditorCursors = () => {
    return (
      <div className="relative">
        {editors.map((editor: EditorPresence) => (
          <div 
            key={editor.id}
            className="absolute"
            style={{
              top: `${Math.floor(editor.cursor.position / 80) * 20}px`, // Approximate line height
              left: '0px'
            }}
          >
            <Badge variant="outline" className="bg-primary/20 text-primary text-xs">
              {editor.name}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border rounded-xl overflow-hidden mb-6">
      <div className="p-1 flex items-center justify-between border-b">
        <div className="flex items-center gap-1 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => applyStyle('bold')}
                >
                  <Bold className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Bold (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => applyStyle('italic')}
                >
                  <Italic className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Italic (Ctrl+I)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Underline className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => applyStyle('h1')}
                >
                  <Heading1 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Heading 1 (Ctrl+1)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => applyStyle('h2')}
                >
                  <Heading2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Heading 2 (Ctrl+2)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => applyStyle('h3')}
                >
                  <Heading3 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Heading 3 (Ctrl+3)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <AlignCenter className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <AlignRight className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ListOrdered className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowKeyboardShortcuts(prev => !prev)}
                  className="text-xs"
                >
                  Keyboard Shortcuts
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Press Ctrl+K to show keyboard shortcuts
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddComment}
                  disabled={!selectedSection}
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Add Comment</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Add a comment to the selected section (Ctrl+/)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {editors.slice(0, 3).map((editor) => (
                <Avatar key={editor.id} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-[10px]">
                    {editor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {editors.length > 3 && (
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-[10px]">
                    +{editors.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 relative">
        {showKeyboardShortcuts && (
          <div className="absolute z-10 right-6 top-6 bg-background border rounded-md shadow-md p-4 text-sm">
            <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
            <ul className="space-y-1">
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+B</kbd> Bold text</li>
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+I</kbd> Italic text</li>
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+1</kbd> Heading 1</li>
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+2</kbd> Heading 2</li>
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+3</kbd> Heading 3</li>
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+/</kbd> Add comment</li>
              <li><kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+K</kbd> Show/hide shortcuts</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => setShowKeyboardShortcuts(false)}
            >
              Close
            </Button>
          </div>
        )}
      
        {selectedSection && (
          <div className="absolute right-6 top-6 z-10">
            <Badge variant="outline" className="bg-primary/20 text-xs">
              Editing: {selectedSection.title}
              {getCommentsForSection(selectedSection.id).length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full px-1.5 text-[10px]">
                  {getCommentsForSection(selectedSection.id).length}
                </span>
              )}
            </Badge>
          </div>
        )}
        <textarea
          ref={editorRef}
          value={documentContent}
          onChange={handleEditorChange}
          onClick={handleEditorClick}
          onFocus={() => beginEditing()}
          onBlur={() => endEditing()}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[600px] p-0 border-none focus:ring-0 resize-none font-mono text-sm relative"
          placeholder="Start typing or use formatting options above..."
        />
        
        {/* Show section markers */}
        {sections.map(section => (
          <div 
            key={section.id}
            className="absolute right-2 cursor-pointer"
            style={{ 
              top: `${Math.floor(section.startPosition / 80) * 20 + 24}px` // Approximate line position
            }}
            onClick={() => {
              setSelectedSection(section);
              if (editorRef.current) {
                editorRef.current.focus();
                editorRef.current.setSelectionRange(section.startPosition, section.startPosition);
                updateCursorPosition(section.startPosition);
              }
            }}
          >
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              {getCommentsForSection(section.id).length > 0 && (
                <MessageSquare className="h-3 w-3" />
              )}
              {section.title}
            </Badge>
          </div>
        ))}
      </div>

      {showCommentDialog && selectedSection && (
        <SectionCommentDialog
          section={selectedSection}
          onClose={() => setShowCommentDialog(false)}
          onSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
};

export default DocumentEditor;
