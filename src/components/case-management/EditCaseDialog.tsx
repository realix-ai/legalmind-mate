
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface EditCaseDialogProps {
  isEditCaseDialogOpen: boolean;
  setIsEditCaseDialogOpen: (isOpen: boolean) => void;
  editCaseName: string;
  setEditCaseName: (name: string) => void;
  editCaseStatus: 'active' | 'pending' | 'closed';
  setEditCaseStatus: (status: 'active' | 'pending' | 'closed') => void;
  editCasePriority: 'high' | 'medium' | 'low';
  setEditCasePriority: (priority: 'high' | 'medium' | 'low') => void;
  editCaseDeadline: Date | undefined;
  setEditCaseDeadline: (deadline: Date | undefined) => void;
  editCaseDescription: string;
  setEditCaseDescription: (description: string) => void;
  handleSaveEditCase: () => void;
}

const EditCaseDialog = ({
  isEditCaseDialogOpen,
  setIsEditCaseDialogOpen,
  editCaseName,
  setEditCaseName,
  editCaseStatus,
  setEditCaseStatus,
  editCasePriority,
  setEditCasePriority,
  editCaseDeadline,
  setEditCaseDeadline,
  editCaseDescription,
  setEditCaseDescription,
  handleSaveEditCase
}: EditCaseDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Case</DialogTitle>
        <DialogDescription>
          Update the case details below.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
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
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="editCaseDeadline" className="text-right">
            Deadline
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="editCaseDeadline"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editCaseDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editCaseDeadline ? (
                    format(editCaseDeadline, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editCaseDeadline}
                  onSelect={setEditCaseDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
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
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsEditCaseDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSaveEditCase}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditCaseDialog;
