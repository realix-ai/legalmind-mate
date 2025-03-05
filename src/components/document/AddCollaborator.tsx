
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AddCollaboratorProps {
  onAddCollaborator: (email: string) => void;
  isLoading?: boolean;
}

const AddCollaborator = ({ onAddCollaborator, isLoading = false }: AddCollaboratorProps) => {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    onAddCollaborator(email);
    setEmail('');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
          <span>Add Collaborator</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collaborator-email">Email address</Label>
            <Input
              id="collaborator-email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? 'Adding...' : 'Add Collaborator'}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AddCollaborator;
