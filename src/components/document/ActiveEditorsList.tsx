
import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRealtimeEditing } from '@/hooks/document/useRealtimeEditing';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CursorText, Users } from 'lucide-react';

interface ActiveEditorsListProps {
  documentId: string | null;
}

const ActiveEditorsList = ({ documentId }: ActiveEditorsListProps) => {
  const { editors, beginEditing, endEditing } = useRealtimeEditing(documentId);
  
  // Begin editing when component mounts, end when it unmounts
  useEffect(() => {
    beginEditing();
    return () => endEditing();
  }, [documentId]);
  
  // Group editors by active status
  const activeEditors = editors.filter(editor => editor.isActive);
  const inactiveEditors = editors.filter(editor => !editor.isActive);
  
  if (editors.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <div className="bg-primary/10 rounded-full p-4 mx-auto w-fit">
          <Users className="h-6 w-6 text-primary/70" />
        </div>
        <p className="text-sm text-muted-foreground">No active editors at the moment</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {activeEditors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Badge className="bg-green-500 h-2 w-2 p-0 rounded-full" />
              Active now ({activeEditors.length})
            </h3>
            <div className="space-y-3">
              {activeEditors.map((editor) => (
                <EditorCard key={editor.id} editor={editor} isActive={true} />
              ))}
            </div>
          </div>
        )}
        
        {inactiveEditors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Badge className="bg-muted h-2 w-2 p-0 rounded-full" />
              Inactive ({inactiveEditors.length})
            </h3>
            <div className="space-y-3">
              {inactiveEditors.map((editor) => (
                <EditorCard key={editor.id} editor={editor} isActive={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

interface EditorCardProps {
  editor: {
    id: string;
    name: string;
    lastActive: number;
    color?: string;
    cursor?: {
      position: number;
    };
  };
  isActive: boolean;
}

const EditorCard = ({ editor, isActive }: EditorCardProps) => {
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-md border ${
        isActive ? 'border-primary/20 bg-primary/5' : ''
      }`}
    >
      <Avatar className="border-2" style={{ borderColor: editor.color || 'transparent' }}>
        <AvatarFallback 
          className="bg-primary/10 text-primary"
          style={{ backgroundColor: `${editor.color}20`, color: editor.color }}
        >
          {editor.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{editor.name}</p>
          {isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <CursorText 
                      className="h-3.5 w-3.5" 
                      style={{ color: editor.color }}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Currently editing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {isActive ? 
            'Editing now' : 
            `Last active ${formatDistanceToNow(editor.lastActive, { addSuffix: true })}`}
        </p>
      </div>
      
      <div className={`w-2 h-2 rounded-full ${
        isActive ? 'bg-green-500' : 'bg-muted-foreground/30'
      }`}></div>
    </div>
  );
};

export default ActiveEditorsList;
