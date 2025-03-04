
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFieldProps {
  editCaseStatus: 'active' | 'pending' | 'closed';
  setEditCaseStatus: (status: 'active' | 'pending' | 'closed') => void;
}

const StatusField = ({ editCaseStatus, setEditCaseStatus }: StatusFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="editCaseStatus" className="text-right">
        Status
      </Label>
      <Select
        value={editCaseStatus}
        onValueChange={(value) => setEditCaseStatus(value as 'active' | 'pending' | 'closed')}
      >
        <SelectTrigger className="col-span-3" id="editCaseStatus">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusField;
