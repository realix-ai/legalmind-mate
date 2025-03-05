
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface ClientNameFieldProps {
  editClientName: string;
  setEditClientName: (name: string) => void;
}

const ClientNameField = ({ editClientName, setEditClientName }: ClientNameFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="editClientName" className="text-right">
        Client Name
      </Label>
      <div className="relative col-span-3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <User className="h-4 w-4" />
        </div>
        <Input
          id="editClientName"
          placeholder="Enter client name"
          value={editClientName}
          onChange={(e) => setEditClientName(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default ClientNameField;
