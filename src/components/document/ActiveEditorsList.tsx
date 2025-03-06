
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRealtimeEditing } from '@/hooks/document/useRealtimeEditing';
import { formatDistanceToNow } from 'date-fns';

interface ActiveEditorsListProps {
  documentId: string | null;
}

const ActiveEditorsList = ({ documentId }: ActiveEditorsListProps) => {
  const { editors } = useRealtimeEditing(documentId);
  
  if (editors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No active editors at the moment</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3">
        {editors.map((editor) => (
          <div 
            key={editor.id} 
            className="flex items-center gap-3 p-3 rounded-md border"
          >
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {editor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{editor.name}</p>
              <p className="text-xs text-muted-foreground">
                {editor.lastActive ? 
                  `Active ${formatDistanceToNow(editor.lastActive, { addSuffix: true })}` : 
                  'Currently editing'}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ${editor.isActive ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ActiveEditorsList;
