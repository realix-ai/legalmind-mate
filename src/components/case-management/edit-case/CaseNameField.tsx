
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CaseNameFieldProps {
  editCaseName: string;
  setEditCaseName: (name: string) => void;
}

const CaseNameField = ({ editCaseName, setEditCaseName }: CaseNameFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="editCaseName" className="text-right">
        Case Name
      </Label>
      <Input
        id="editCaseName"
        value={editCaseName}
        onChange={(e) => setEditCaseName(e.target.value)}
        className="col-span-3"
      />
    </div>
  );
};

export default CaseNameField;
