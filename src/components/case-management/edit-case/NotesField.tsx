
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  editCaseDescription: string;
  setEditCaseDescription: (description: string) => void;
}

const NotesField = ({ editCaseDescription, setEditCaseDescription }: NotesFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="editCaseDescription" className="text-right pt-2">
        Notes
      </Label>
      <Textarea
        id="editCaseDescription"
        value={editCaseDescription}
        onChange={(e) => setEditCaseDescription(e.target.value)}
        className="col-span-3"
        placeholder="Add case description"
        rows={3}
      />
    </div>
  );
};

export default NotesField;
