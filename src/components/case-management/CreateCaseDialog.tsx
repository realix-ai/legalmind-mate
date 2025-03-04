
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CreateCaseDialogProps {
  newCaseName: string;
  setNewCaseName: (name: string) => void;
  handleCreateCase: () => void;
}

const CreateCaseDialog = ({
  newCaseName,
  setNewCaseName,
  handleCreateCase
}: CreateCaseDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Case</DialogTitle>
        <DialogDescription>
          Add details for your new case.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="caseName" className="text-right">
            Case Name
          </Label>
          <Input
            id="caseName"
            value={newCaseName}
            onChange={(e) => setNewCaseName(e.target.value)}
            className="col-span-3"
            placeholder="Enter case name"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleCreateCase}>Create Case</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateCaseDialog;
