
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollaboratorStatus } from '@/hooks/document/useDocumentCollaboration';

interface CollaboratorsListProps {
  collaborators: CollaboratorStatus[];
  onRemoveCollaborator?: (id: string) => void;
}

const CollaboratorsList = ({ collaborators, onRemoveCollaborator }: CollaboratorsListProps) => {
  return (
    <div className="space-y-2">
      {collaborators.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-3">No collaborators yet</p>
      ) : (
        collaborators.map((collaborator) => (
          <div key={collaborator.id} className="flex items-center gap-2 p-2 border rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarFallback 
                className={
                  collaborator.status === 'offline' && collaborator.name.includes('Pending') 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-primary/10 text-primary text-xs'
                }
              >
                {collaborator.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-medium text-sm truncate">{collaborator.name}</span>
                <span className="ml-2">
                  <Badge className={`text-[10px] ${
                    collaborator.status === 'online' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                      : collaborator.status === 'away'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }`}>
                    {collaborator.name.includes('Pending') ? 'pending' : collaborator.status}
                  </Badge>
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {collaborator.name.includes('Pending') 
                  ? `Invitation sent${collaborator.email ? ` to ${collaborator.email}` : ''}`
                  : collaborator.status === 'online' 
                    ? 'Currently active' 
                    : `Last seen ${formatDistanceToNow(collaborator.lastActive, { addSuffix: true })}`}
              </div>
            </div>
            
            {onRemoveCollaborator && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => onRemoveCollaborator(collaborator.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CollaboratorsList;
