
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRealtimeEditing, EditorPresence } from '@/hooks/document/useRealtimeEditing';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Clock } from 'lucide-react';

interface ActiveEditorsListProps {
  documentId: string | null;
}

const ActiveEditorsList = ({ documentId }: ActiveEditorsListProps) => {
  const { editors } = useRealtimeEditing(documentId || '');
  
  if (editors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-primary/10 rounded-full p-4 mb-3">
          <User className="h-6 w-6 text-primary/70" />
        </div>
        <h3 className="text-base font-medium mb-1">No active editors</h3>
        <p className="text-sm text-muted-foreground">
          You're the only one working on this document right now
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 p-2">
      <h3 className="text-sm font-medium">Active Editors</h3>
      
      <div className="space-y-2">
        {editors.map((editor) => (
          <div key={editor.id} className="flex items-center gap-3 p-2 border rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {editor.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-sm">{editor.name}</span>
                <Badge 
                  className="ml-2 text-[10px] bg-green-100 text-green-800 hover:bg-green-100"
                >
                  {Date.now() - editor.lastActive < 2 * 60 * 1000 ? 'active' : 'idle'}
                </Badge>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Last active {formatDistanceToNow(editor.lastActive, { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveEditorsList;
