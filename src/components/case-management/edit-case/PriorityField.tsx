
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriorityFieldProps {
  editCasePriority: 'high' | 'medium' | 'low';
  setEditCasePriority: (priority: 'high' | 'medium' | 'low') => void;
}

const PriorityField = ({ editCasePriority, setEditCasePriority }: PriorityFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="editCasePriority" className="text-right">
        Priority
      </Label>
      <Select
        value={editCasePriority}
        onValueChange={(value) => setEditCasePriority(value as 'high' | 'medium' | 'low')}
      >
        <SelectTrigger className="col-span-3" id="editCasePriority">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PriorityField;
